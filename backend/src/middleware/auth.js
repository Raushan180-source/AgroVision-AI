const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    const token = authHeader.split(' ')[1]
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Session expired, please log in again'
        : 'Not authorized, invalid token'
      return res.status(401).json({ message })
    }

    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ message: 'User no longer exists' })

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { protect }
