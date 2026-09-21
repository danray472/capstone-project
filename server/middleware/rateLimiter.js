const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { createAuditLog, extractIpAddress, extractUserAgent } = require('../utils/auditLogger');

// Keep the limiter focused on genuine brute-force bursts, not normal user mistakes.
// This is intentionally higher than a strict production default so early deployment/testing
// does not trigger lockouts from ordinary failed logins.
const maxAttempts = 50;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: maxAttempts,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const ipKey = ipKeyGenerator(req.ip);
    const userIdentifier = req.body?.email || req.body?.username || req.ip;
    return `${ipKey}:${userIdentifier}`;
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many login attempts from this IP, please try again after 15 minutes'
  },
  handler: async (req, res) => {
    await createAuditLog({
      action: 'RATE_LIMIT_EXCEEDED',
      status: 'warning',
      userId: req.userId || null,
      details: {
        endpoint: req.path,
        method: req.method,
        email: req.body?.email || null,
        username: req.body?.username || null,
      },
      ipAddress: extractIpAddress(req),
      userAgent: extractUserAgent(req),
    });

    res.status(429).json({
      error: 'Too many login attempts from this IP, please try again after 15 minutes'
    });
  },
});

module.exports = {
  authLimiter,
};
