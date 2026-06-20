const Review = require('../models/Review');
const WorkerProfile = require('../models/WorkerProfile');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private (temporarily removed for testing)
const createReview = async (req, res) => {
  try {
    const { clientId, workerId, jobRequestId, rating, comment } = req.body;

    // Check if client already reviewed this specific job
    const existingReview = await Review.findOne({ jobRequestId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this job' });
    }

    const reviewData = {
      clientId,
      workerId,
      jobRequestId,
      rating,
      comment,
    };

    const review = await Review.create(reviewData);

    // Update worker's average rating and total reviews
    await updateWorkerRating(workerId);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get worker's reviews
// @route   GET /api/reviews/worker/:workerId
// @access  Public
const getWorkerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ workerId: req.params.workerId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get review by job request ID
// @route   GET /api/reviews/job/:jobRequestId
// @access  Public
const getReviewByJobRequest = async (req, res) => {
  try {
    const review = await Review.findOne({ jobRequestId: req.params.jobRequestId });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update worker's average rating
// @route   Internal function
const updateWorkerRating = async (workerId) => {
  try {
    console.log(`[updateWorkerRating] Updating rating for workerId: ${workerId}`);
    const reviews = await Review.find({ workerId });
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    console.log(`[updateWorkerRating] Found ${totalReviews} reviews, average: ${averageRating.toFixed(1)}`);

    // Update the worker profile by _id (workerId is now the profile ID)
    const updatedProfile = await WorkerProfile.findByIdAndUpdate(workerId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews,
    }, { new: true });

    if (!updatedProfile) {
      console.error(`[updateWorkerRating] Profile not found with workerId: ${workerId}`);
    } else {
      console.log(`[updateWorkerRating] Updated profile: ${updatedProfile._id}, new rating: ${updatedProfile.averageRating}, total reviews: ${updatedProfile.totalReviews}`);
    }
  } catch (error) {
    console.error(`[updateWorkerRating] Error: ${error.message}`);
  }
};

module.exports = {
  createReview,
  getWorkerReviews,
  getReviewByJobRequest,
};
