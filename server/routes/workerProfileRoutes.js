const express = require('express');
const router = express.Router();
const {
  createProfile,
  updateProfile,
  getMyProfile,
  getProfileById,
  getAllProfiles,
} = require('../controllers/workerProfileController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/profiles
// @desc    Create worker profile
// @access  Private (temporarily removed for testing)
router.post('/', createProfile);

// Test endpoint
router.post('/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ message: 'Test works' });
});

// @route   PUT /api/profiles
// @desc    Update worker profile
// @access  Private (temporarily removed for testing)
router.put('/', updateProfile);

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
