const AuditLog = require('../models/AuditLog');
const User = require('../models/User');
const { createAuditLog, extractIpAddress, extractUserAgent } = require('../utils/auditLogger');

// @desc    Get all users with filtering, searching, and pagination
// @route   GET /api/admin/users
// @access  Admin only
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Filter by role
    if (req.query.role && ['client', 'worker', 'admin'].includes(req.query.role)) {
      filter.role = req.query.role;
    }

    // Filter by account status
    if (req.query.status === 'blocked') {
      filter.isBlocked = true;
    } else if (req.query.status === 'active') {
      filter.isActive = { $ne: false };
      filter.isBlocked = { $ne: true };
    } else if (req.query.status === 'inactive') {
      filter.isActive = false;
    }

    // Search by full name or email
    if (req.query.search && req.query.search.trim()) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
      ];
    }

    // Query users excluding sensitive password field
    const users = await User.find(filter)
      .select('-password')
      .populate('blockedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    // Summary counts for dashboard badges
    const [totalUsers, activeUsers, blockedUsers, inactiveUsers, workerCount, clientCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBlocked: { $ne: true }, isActive: { $ne: false } }),
      User.countDocuments({ isBlocked: true }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ role: 'worker' }),
      User.countDocuments({ role: 'client' }),
    ]);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      stats: {
        totalUsers,
        activeUsers,
        blockedUsers,
        inactiveUsers,
        workerCount,
        clientCount,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Block or unblock a user account (suspension toggle)
// @route   PATCH /api/admin/users/:id/block
// @access  Admin only
const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked, reason } = req.body;

    // Prevent admin from blocking themselves
    if (req.userId && req.userId.toString() === id) {
      return res.status(400).json({ message: 'You cannot block or suspend your own account' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Determine target block status (support explicit boolean or toggle)
    const newBlockStatus = typeof isBlocked === 'boolean' ? isBlocked : !user.isBlocked;
    const blockReason = newBlockStatus ? (reason ? reason.trim() : 'Suspended by administrator') : '';

    user.isBlocked = newBlockStatus;
    user.blockReason = blockReason;
    user.blockedAt = newBlockStatus ? new Date() : null;
    user.blockedBy = newBlockStatus ? req.userId : null;

    await user.save();

    // Audit log action without logging sensitive data
    const action = newBlockStatus ? 'ACCOUNT_BLOCKED' : 'ACCOUNT_UNBLOCKED';
    await createAuditLog({
      action,
      status: 'success',
      userId: user._id,
      details: {
        targetUserId: user._id,
        targetEmail: user.email,
        targetRole: user.role,
        isBlocked: newBlockStatus,
        reason: blockReason || undefined,
        performedBy: req.userId,
      },
      ipAddress: extractIpAddress(req),
      userAgent: extractUserAgent(req),
    });

    res.json({
      message: newBlockStatus
        ? `Account for ${user.email} has been suspended`
        : `Account for ${user.email} has been unblocked`,
      user,
    });
  } catch (error) {
    console.error('Error updating user block status:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Deactivate or reactivate user account (soft deletion)
// @route   PATCH /api/admin/users/:id/deactivate
// @access  Admin only
const toggleDeactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, reason } = req.body;

    // Prevent admin from deactivating themselves
    if (req.userId && req.userId.toString() === id) {
      return res.status(400).json({ message: 'You cannot deactivate your own account' });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newActiveStatus = typeof isActive === 'boolean' ? isActive : !user.isActive;

    user.isActive = newActiveStatus;
    if (!newActiveStatus) {
      // When deactivating, also mark as blocked to prevent login
      user.isBlocked = true;
      user.blockReason = reason ? reason.trim() : 'Account deactivated (soft deleted)';
      user.blockedAt = new Date();
      user.blockedBy = req.userId;
    } else {
      // When reactivating, clear suspension if reason was deactivation
      user.isBlocked = false;
      user.blockReason = '';
      user.blockedAt = null;
      user.blockedBy = null;
    }

    await user.save();

    // Audit log action (prefer soft delete auditing over permanent delete)
    const action = newActiveStatus ? 'ACCOUNT_REACTIVATED' : 'ACCOUNT_DEACTIVATED';
    await createAuditLog({
      action,
      status: 'success',
      userId: user._id,
      details: {
        targetUserId: user._id,
        targetEmail: user.email,
        targetRole: user.role,
        isActive: newActiveStatus,
        softDeleted: !newActiveStatus,
        reason: user.blockReason || undefined,
        performedBy: req.userId,
      },
      ipAddress: extractIpAddress(req),
      userAgent: extractUserAgent(req),
    });

    res.json({
      message: newActiveStatus
        ? `Account for ${user.email} reactivated successfully`
        : `Account for ${user.email} deactivated (soft deleted) successfully`,
      user,
    });
  } catch (error) {
    console.error('Error updating user active status:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all audit logs with filtering and pagination
// @route   GET /api/admin/audit-logs
// @access  Admin only
const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query filter
    const filter = {};

    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Filter by action if provided
    if (req.query.action) {
      filter.action = req.query.action;
    }

    // Filter by userId if provided
    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    // Execute query with pagination
    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'fullName email role');

    // Get total count for pagination metadata
    const total = await AuditLog.countDocuments(filter);

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get audit log statistics
// @route   GET /api/admin/audit-logs/stats
// @access  Admin only
const getAuditLogStats = async (req, res) => {
  try {
    const stats = await AuditLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const statusStats = await AuditLog.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalLogs = await AuditLog.countDocuments();

    res.json({
      totalLogs,
      actionStats: stats,
      statusStats: statusStats,
    });
  } catch (error) {
    console.error('Error fetching audit log stats:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUsers,
  toggleBlockUser,
  toggleDeactivateUser,
  getAuditLogs,
  getAuditLogStats,
};
