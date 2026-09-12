const express = require('express');
const router = express.Router();
const {
  getUsers,
  toggleBlockUser,
  toggleDeactivateUser,
  getAuditLogs,
  getAuditLogStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/users
// @desc    Get all users with search, filtering and pagination
// @access  Admin only
router.get('/users', getUsers);

// @route   PATCH /api/admin/users/:id/block
// @desc    Block or unblock user account (suspension)
// @access  Admin only
router.patch('/users/:id/block', toggleBlockUser);

// @route   PATCH /api/admin/users/:id/deactivate
// @desc    Deactivate or reactivate user account (soft deletion)
// @access  Admin only
router.patch('/users/:id/deactivate', toggleDeactivateUser);

// @route   GET /api/admin/audit-logs
// @desc    Get all audit logs with filtering and pagination
// @access  Admin only
router.get('/audit-logs', getAuditLogs);

// @route   GET /api/admin/audit-logs/stats
// @desc    Get audit log statistics
// @access  Admin only
router.get('/audit-logs/stats', getAuditLogStats);

module.exports = router;
