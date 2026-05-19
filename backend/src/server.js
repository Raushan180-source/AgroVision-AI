require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')
const csrfProtection = require('./middleware/csrfProtection')

const app = express()

// Connect DB
connectDB()

// Security headers
app.use(helmet())

// CORS — explicit origin required when credentials: true
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000']

app.use(cors({
  origin: '*',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Logging
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'))

// Global rate limiter — 100 req / 15 min per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
}))

// CSRF protection for all state-mutating routes
app.use(csrfProtection)

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/predictions', require('./routes/predictions'))
app.use('/api/crops', require('./routes/crops'))
app.use('/api/chat', require('./routes/chat'))

// Health check
app.get("/", (req, res) => {
  res.send("AgroVision AI Backend Running Successfully 🚀");
});

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', service: 'AgroVision AI Backend', env: process.env.NODE_ENV })
)

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Error handler (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`))
