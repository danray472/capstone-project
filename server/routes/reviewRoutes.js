const express = require('express');
const router = express.Router();
const {
  createReview,
  getWorkerReviews,
  getReviewByJobRequest,
} = require('../controllers/reviewController');

// @route   POST /api/reviews
// @desc    Create review
// @access  Private (temporarily removed for testing)
router.post('/', createReview);

// @route   GET /api/reviews/worker/:workerId
// @desc    Get worker's reviews
// @access  Public
router.get('/worker/:workerId', getWorkerReviews);

// @route   GET /api/reviews/job/:jobRequestId
// @desc    Get review by job request ID
// @access  Public
router.get('/job/:jobRequestId', getReviewByJobRequest);

module.exports = router;
