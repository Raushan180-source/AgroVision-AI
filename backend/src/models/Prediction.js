const mongoose = require('mongoose')

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, default: '' },
  crop: { type: String, required: true },
  disease: { type: String, required: true },
  status: { type: String, enum: ['healthy', 'infected'], required: true },
  confidence: { type: Number, required: true },
  description: { type: String, default: '' },
  recommendations: {
    pesticides: [String],
    fertilizers: [String],
    prevention: [String],
  },
  nutrientTips: [String],
}, { timestamps: true })

module.exports = mongoose.model('Prediction', predictionSchema)
