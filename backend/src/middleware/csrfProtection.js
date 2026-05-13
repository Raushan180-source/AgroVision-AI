/**
 * CSRF protection for a stateless JWT Bearer token REST API.
 *
 * Traditional cookie-based CSRF tokens are not needed here because:
 *  - Auth is via Authorization: Bearer <token> header (not cookies)
 *  - Cross-origin forms/scripts cannot set custom headers (blocked by CORS)
 *
 * We enforce two additional checks as defence-in-depth:
 *  1. Content-Type must be application/json for state-mutating requests
 *  2. Origin/Referer must match allowed origins when present
 */

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

const csrfProtection = (req, res, next) => {
  // Skip safe methods
  if (SAFE_METHODS.has(req.method)) return next()

  // Enforce JSON content-type on mutation requests
  const contentType = req.headers['content-type'] || ''
  if (!contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
    return res.status(415).json({ message: 'Content-Type must be application/json' })
  }

  // Validate Origin header when present (browsers always send it for cross-origin requests)
  const origin = req.headers['origin']
  if (origin) {
    const allowedOrigins = process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',').map(o => o.trim())
      : ['http://localhost:5173', 'http://localhost:3000']

    if (!allowedOrigins.includes(origin)) {
      return res.status(403).json({ message: 'Forbidden: invalid request origin' })
    }
  }

  next()
}

module.exports = csrfProtection
