const AuditLog = require('../models/AuditLog');

/**
 * Create an audit log entry
 * @param {Object} logData - The audit log data
 * @param {String} logData.action - The action being logged (e.g., 'LOGIN_SUCCESS')
 * @param {String} logData.status - The status of the action ('success', 'failure', 'warning')
 * @param {String} [logData.userId] - Optional user ID
 * @param {Object} [logData.details] - Optional additional details
 * @param {String} [logData.ipAddress] - Optional IP address
 * @param {String} [logData.userAgent] - Optional user agent
 * @returns {Promise<Object>} The created audit log
 */
const createAuditLog = async (logData) => {
  try {
    const { action, status, userId, details, ipAddress, userAgent } = logData;

    // Validate required fields
    if (!action || !status) {
      console.error('Audit log missing required fields:', { action, status });
      return null;
    }

    // Sanitize details to prevent logging sensitive information
    const sanitizedDetails = details ? sanitizeDetails(details) : {};

    const auditLog = await AuditLog.create({
      userId,
      action,
      status,
      details: sanitizedDetails,
      ipAddress,
      userAgent,
    });

    console.log(`Audit log created: ${action} - ${status}`);
    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error.message);
    // Don't throw error to prevent breaking the main application flow
    return null;
  }
};

/**
 * Sanitize details to remove sensitive information (passwords, JWT tokens, etc.)
 * @param {Object} details - The details object to sanitize
 * @returns {Object} Sanitized details
 */
const sanitizeDetails = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitivePattern = /password|token|jwt|secret|apiKey|auth|bearer|cookie|credential/i;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeDetails(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (sensitivePattern.test(key)) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeDetails(value);
    } else if (typeof value === 'string' && /^(Bearer\s+[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*|eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+)/i.test(value)) {
      sanitized[key] = '[REDACTED_TOKEN]';
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Extract IP address from request
 * @param {Object} req - Express request object
 * @returns {String} IP address
 */
const extractIpAddress = (req) => {
  return req.ip || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
         'unknown';
};

/**
 * Extract user agent from request
 * @param {Object} req - Express request object
 * @returns {String} User agent string
 */
const extractUserAgent = (req) => {
  return req.headers['user-agent'] || 'unknown';
};

module.exports = {
  createAuditLog,
  extractIpAddress,
  extractUserAgent,
};
