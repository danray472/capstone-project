const WorkerProfile = require('../models/WorkerProfile');

// @desc    Create worker profile
// @route   POST /api/profiles
// @access  Private (temporarily removed for testing)
const createProfile = async (req, res) => {
  try {
    const { userId, profession, bio, location, phone, skills, experience, profilePhoto } = req.body;

    // Use userId from request or fallback
    const finalUserId = userId || '6a2c83bd24922691f1033bc3';

    // Check if profile already exists for this user
    const existingProfile = await WorkerProfile.findOne({ userId: finalUserId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }

    const profileData = {
      userId: finalUserId,
      profession,
      bio,
      location,
      phone,
      skills: skills || [],
      experience,
      profilePhoto: profilePhoto || '',
    };

    const profile = await WorkerProfile.create(profileData);
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update worker profile
// @route   PUT /api/profiles
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { profession, bio, location, phone, skills, experience, profilePhoto } = req.body;

    const profile = await WorkerProfile.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.profession = profession || profile.profession;
    profile.bio = bio || profile.bio;
    profile.location = location || profile.location;
    profile.phone = phone || profile.phone;
    profile.skills = skills || profile.skills;
    profile.experience = experience || profile.experience;
    profile.profilePhoto = profilePhoto || profile.profilePhoto;

    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user's profile
// @route   GET /api/profiles/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    // Get userId from authenticated request
    const userId = req.userId;

    const profile = await WorkerProfile.findOne({ userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Fetch user data to get fullName
    const User = require('../models/User');
    const user = await User.findById(userId).select('fullName email');

    res.json({
      ...profile.toObject(),
      userData: user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get profile by ID
// @route   GET /api/profiles/:id
// @access  Public
const getProfileById = async (req, res) => {
  try {
    const profile = await WorkerProfile.findById(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Fetch user data to get fullName
    const User = require('../models/User');
    const user = await User.findById(profile.userId).select('fullName email');

    res.json({
      ...profile.toObject(),
      userData: user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all worker profiles
// @route   GET /api/profiles
// @access  Public
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await WorkerProfile.find();
    
    // Fetch user data for each profile
    const User = require('../models/User');
    const profilesWithUserData = await Promise.all(
      profiles.map(async (profile) => {
        const user = await User.findById(profile.userId).select('fullName email');
        return {
          ...profile.toObject(),
          userData: user,
        };
      })
    );
    
    res.json(profilesWithUserData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createProfile,
  updateProfile,
  getMyProfile,
  getProfileById,
  getAllProfiles,
};
