const rateLimit = require('express-rate-limit');
const { createAuditLog, extractIpAddress, extractUserAgent } = require('../utils/auditLogger');

// General rate limiter for all API routes
// Limits: 100 requests per 15 minutes per IP
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Trust proxy headers when behind reverse proxy (Render)
  trustProxy: true,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again after 15 minutes'
    });
  },
});

// Strict rate limiter for authentication routes
// Limits: 5 requests per 15 minutes per IP (prevents brute force attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: async (req, res) => {
    // Log rate limit exceeded
    await createAuditLog({
      action: 'RATE_LIMIT_EXCEEDED',
      status: 'warning',
      userId: req.userId || null,
      details: {
        endpoint: req.path,
        method: req.method,
      },
      ipAddress: extractIpAddress(req),
      userAgent: extractUserAgent(req),
    });

    res.status(429).json({
      error: 'Too many login attempts from this IP, please try again after 15 minutes'
    });
  },
});

// Rate limiter for sensitive operations (profile updates, job requests, etc.)
// Limits: 20 requests per 15 minutes per IP
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter,
  strictLimiter
};
