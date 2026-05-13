const express = require('express')
const predictionController = require('../controllers/predictionController')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
const { savePrediction, getHistory, getStats } = predictionController
const { protect } = authMiddleware

router.use(protect)
router.post('/', savePrediction)
router.get('/history', getHistory)
router.get('/stats', getStats)

module.exports = router
