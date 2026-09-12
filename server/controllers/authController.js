const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createAuditLog, extractIpAddress, extractUserAgent } = require('../utils/auditLogger');

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { fullName, email, password, role, idNumber } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate ID number for workers
    if (role === 'worker' && (!idNumber || !idNumber.trim())) {
      return res.status(400).json({ message: 'National ID number is required for worker accounts' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'client',
      idNumber: role === 'worker' ? (idNumber ? idNumber.trim() : '') : '',
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Log successful registration
    await createAuditLog({
      action: 'USER_REGISTERED',
      status: 'success',
      userId: user._id,
      details: {
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        hasIdNumber: Boolean(user.idNumber),
      },
      ipAddress: extractIpAddress(req),
      userAgent: extractUserAgent(req),
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      idNumber: user.idNumber || '',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Log failed login - user not found
      await createAuditLog({
        action: 'LOGIN_FAILED',
        status: 'failure',
        userId: null,
        details: {
          email: email,
          reason: 'User not found',
        },
        ipAddress: extractIpAddress(req),
        userAgent: extractUserAgent(req),
      });

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Log failed login - incorrect password
      await createAuditLog({
        action: 'LOGIN_FAILED',
        status: 'failure',
        userId: user._id,
        details: {
          email: user.email,
          reason: 'Incorrect password',
        },
        ipAddress: extractIpAddress(req),
        userAgent: extractUserAgent(req),
      });

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is suspended or deactivated
    if (user.isBlocked || user.isActive === false) {
      await createAuditLog({
        action: 'LOGIN_FAILED',
        status: 'warning',
        userId: user._id,
        details: {
          email: user.email,
          reason: user.isBlocked ? 'Account suspended' : 'Account deactivated',
          blockReason: user.blockReason || undefined,
        },
        ipAddress: extractIpAddress(req),
        userAgent: extractUserAgent(req),
      });

      return res.status(403).json({
        message: user.isBlocked
          ? (user.blockReason ? `Your account has been suspended: "${user.blockReason}". Please contact support.` : 'Your account has been suspended. Please contact support.')
          : 'Your account has been deactivated. Please contact support to reactivate.'
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Log successful login
    await createAuditLog({
      action: 'LOGIN_SUCCESS',
      status: 'success',
      userId: user._id,
      details: {
        email: user.email,
        role: user.role,
      },
      ipAddress: extractIpAddress(req),
      userAgent: extractUserAgent(req),
    });

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      idNumber: user.idNumber || '',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // Log logout event
    if (req.userId) {
      await createAuditLog({
        action: 'LOGOUT',
        status: 'success',
        userId: req.userId,
        details: {
          email: req.body.email || 'unknown',
        },
        ipAddress: extractIpAddress(req),
        userAgent: extractUserAgent(req),
      });
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
};
