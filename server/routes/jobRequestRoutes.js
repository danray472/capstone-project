const express = require('express');
const router = express.Router();
const {
  createJobRequest,
  updateJobRequestStatus,
  getClientJobRequests,
  getWorkerJobRequests,
  getJobRequestById,
} = require('../controllers/jobRequestController');

// @route   POST /api/requests
// @desc    Create job request
// @access  Private (temporarily removed for testing)
router.post('/', createJobRequest);

// @route   PUT /api/requests/:id/status
// @desc    Update job request status
// @access  Private (temporarily removed for testing)
router.put('/:id/status', updateJobRequestStatus);

// @route   GET /api/requests/client/:clientId
// @desc    Get client's job requests
// @access  Private (temporarily removed for testing)
router.get('/client/:clientId', getClientJobRequests);

// @route   GET /api/requests/worker/:workerId
// @desc    Get worker's job requests
// @access  Private (temporarily removed for testing)
router.get('/worker/:workerId', getWorkerJobRequests);

// @route   GET /api/requests/:id
// @desc    Get job request by ID
// @access  Private (temporarily removed for testing)
router.get('/:id', getJobRequestById);

module.exports = router;
