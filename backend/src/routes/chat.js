const express = require('express')
const chatController = require('../controllers/chatController')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
const { chat } = chatController
const { protect } = authMiddleware

router.post('/', protect, chat)

module.exports = router
