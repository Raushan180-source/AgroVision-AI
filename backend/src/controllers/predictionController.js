const Prediction = require('../models/Prediction')

const ALLOWED_FIELDS = ['imageUrl', 'crop', 'disease', 'status', 'confidence', 'description', 'recommendations', 'nutrientTips']

const savePrediction = async (req, res, next) => {
  try {
    // Whitelist fields — prevent mass assignment (e.g. attacker setting user field)
    const data = {}
    ALLOWED_FIELDS.forEach(key => {
      if (req.body[key] !== undefined) data[key] = req.body[key]
    })

    // Validate required fields
    if (!data.crop || !data.disease || !data.status || data.confidence === undefined) {
      return res.status(400).json({ message: 'crop, disease, status and confidence are required' })
    }
    if (!['healthy', 'infected'].includes(data.status)) {
      return res.status(400).json({ message: 'status must be healthy or infected' })
    }
    if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 100) {
      return res.status(400).json({ message: 'confidence must be a number between 0 and 100' })
    }

    const prediction = await Prediction.create({ ...data, user: req.user._id })
    res.status(201).json(prediction)
  } catch (err) {
    next(err)
  }
}

const getHistory = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20))
    const skip = (page - 1) * limit

    const [predictions, total] = await Promise.all([
      Prediction.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Prediction.countDocuments({ user: req.user._id }),
    ])

    res.json({ predictions, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
}

const getStats = async (req, res, next) => {
  try {
    const [total, healthy] = await Promise.all([
      Prediction.countDocuments({ user: req.user._id }),
      Prediction.countDocuments({ user: req.user._id, status: 'healthy' }),
    ])
    res.json({ total, healthy, infected: total - healthy })
  } catch (err) {
    next(err)
  }
}

module.exports = { savePrediction, getHistory, getStats }
