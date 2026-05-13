const jwt = require('jsonwebtoken')
const validator = require('validator')
const User = require('../models/User')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body

    // Input validation
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' })
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const user = await User.create({
      name: validator.escape(name.trim()),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim() || '',
    })

    const token = signToken(user._id)
    res.status(201).json({ token, user })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' })
    }

    // Explicitly select password (it's excluded by default via select: false)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      // Same message for both cases — prevents user enumeration
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = signToken(user._id)
    // Return user without password (toJSON strips it)
    res.json({ token, user })
  } catch (err) {
    next(err)
  }
}

const getProfile = (req, res) => {
  res.json({ user: req.user })
}

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location, farmSize, primaryCrop } = req.body

    // Validate name if provided
    if (name !== undefined && name.trim().length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' })
    }

    // Only update allowed fields — never allow email/password/role via this route
    const updates = {}
    if (name !== undefined) updates.name = validator.escape(name.trim())
    if (phone !== undefined) updates.phone = phone.trim()
    if (location !== undefined) updates.location = location.trim()
    if (farmSize !== undefined) updates.farmSize = parseFloat(farmSize) || 0
    if (primaryCrop !== undefined) updates.primaryCrop = primaryCrop.trim()

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })

    res.json({ user })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, getProfile, updateProfile }
