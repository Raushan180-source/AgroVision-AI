const express = require('express')
const cropController = require('../controllers/cropController')
const authMiddleware = require('../middleware/auth')

const router = express.Router()
const { suggestCrops, soilAnalysis } = cropController
const { protect } = authMiddleware

router.use(protect)
router.post('/suggest', suggestCrops)
router.post('/soil-analysis', soilAnalysis)

module.exports = router
