const express = require('express')
const rateLimit = require('express-rate-limit')
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
const { register, login, getProfile, updateProfile } = authController
const { protect } = authMiddleware

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many auth attempts, please try again in 15 minutes.' },
})

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

module.exports = router
