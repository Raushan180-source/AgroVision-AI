const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true, minlength: [2, 'Name must be at least 2 characters'] },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  // select: false — password is NEVER returned in queries unless explicitly .select('+password')
  password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters'], select: false },
  phone: { type: String, default: '', trim: true },
  location: { type: String, default: '', trim: true },
  farmSize: { type: Number, default: 0, min: 0 },
  primaryCrop: { type: String, default: '', trim: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)
