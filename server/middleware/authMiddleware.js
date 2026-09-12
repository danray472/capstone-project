const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Protect routes
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Verify user exists and check suspension / deactivation
      const user = await User.findById(decoded.userId).select('fullName email role isBlocked isActive blockReason');
      if (!user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      if (user.isBlocked || user.isActive === false) {
        return res.status(403).json({
          message: user.isBlocked
            ? (user.blockReason ? `Account suspended: ${user.blockReason}` : 'Account has been suspended')
            : 'Account has been deactivated'
        });
      }

      // Add user ID and role to request object
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role;

      return next();
    } catch (error) {
      console.error('Auth middleware - Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

// @desc    Authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        message: `User role '${req.userRole}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
