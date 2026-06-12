const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createProfile,
  updateProfile,
  getMyProfile,
  getProfileById,
  getAllProfiles,
} = require('../controllers/workerProfileController');

// @route   POST /api/profiles
// @desc    Create worker profile
// @access  Private
router.post('/', protect, createProfile);

// @route   PUT /api/profiles
// @desc    Update worker profile
// @access  Private
router.put('/', protect, updateProfile);

// @route   GET /api/profiles/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, getMyProfile);

// @route   GET /api/profiles/:id
// @desc    Get profile by ID
// @access  Public
router.get('/:id', getProfileById);

// @route   GET /api/profiles
// @desc    Get all worker profiles
// @access  Public
router.get('/', getAllProfiles);

module.exports = router;
