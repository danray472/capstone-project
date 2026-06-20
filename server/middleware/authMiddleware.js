const jwt = require('jsonwebtoken');

// @desc    Protect routes
const protect = (req, res, next) => {
  let token;

  console.log('Auth middleware - Authorization header:', req.headers.authorization);

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth middleware - Token extracted');

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Auth middleware - Token verified, userId:', decoded.userId);

      // Add user ID to request object
      req.userId = decoded.userId;

      return next();
    } catch (error) {
      console.error('Auth middleware - Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  console.log('Auth middleware - No token found');
  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };
