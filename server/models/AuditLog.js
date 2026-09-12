const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional since failed login may not have a valid user
  },
  action: {
    type: String,
    required: [true, 'Please provide an action'],
    enum: [
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'USER_REGISTERED',
      'LOGOUT',
      'PASSWORD_CHANGED',
      'PROFILE_UPDATED',
      'ADMIN_ACTION',
      'ROLE_CHANGED',
      'USER_DELETED',
      'ACCOUNT_BLOCKED',
      'ACCOUNT_UNBLOCKED',
      'ACCOUNT_DEACTIVATED',
      'ACCOUNT_REACTIVATED',
      'RATE_LIMIT_EXCEEDED'
    ],
  },
  status: {
    type: String,
    required: [true, 'Please provide a status'],
    enum: ['success', 'failure', 'warning'],
    default: 'success',
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: false, // Optional additional context
  },
  ipAddress: {
    type: String,
    required: false,
  },
  userAgent: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
