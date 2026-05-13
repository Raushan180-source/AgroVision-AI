const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || err.status || 500
  let message = err.message || 'Internal Server Error'

  // Mongoose validation error → 400
  if (err.name === 'ValidationError') {
    status = 400
    message = Object.values(err.errors).map(e => e.message).join(', ')
  }

  // Mongoose bad ObjectId → 400
  if (err.name === 'CastError') {
    status = 400
    message = `Invalid ${err.path}: ${err.value}`
  }

  // Mongoose duplicate key → 409
  if (err.code === 11000) {
    status = 409
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  }

  // JWT errors (shouldn't reach here normally, but just in case)
  if (err.name === 'JsonWebTokenError') {
    status = 401
    message = 'Invalid token'
  }
  if (err.name === 'TokenExpiredError') {
    status = 401
    message = 'Session expired, please log in again'
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${status}] ${message}`, err.stack)
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorHandler
