const WorkerProfile = require('../models/WorkerProfile');

// @desc    Create worker profile
// @route   POST /api/profiles
// @access  Private
const createProfile = async (req, res) => {
  try {
    const { profession, bio, location, phone, skills, experience, profilePhoto } = req.body;

    // Check if profile already exists for this user
    const existingProfile = await WorkerProfile.findOne({ userId: req.userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }

    const profile = await WorkerProfile.create({
      userId: req.userId,
      profession,
      bio,
      location,
      phone,
      skills: skills || [],
      experience,
      profilePhoto: profilePhoto || '',
    });

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
    const profile = await WorkerProfile.findOne({ userId: req.userId }).populate('userId', 'fullName email');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get profile by ID
// @route   GET /api/profiles/:id
// @access  Public
const getProfileById = async (req, res) => {
  try {
    const profile = await WorkerProfile.findById(req.params.id).populate('userId', 'fullName email');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all worker profiles
// @route   GET /api/profiles
// @access  Public
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await WorkerProfile.find().populate('userId', 'fullName email');
    res.json(profiles);
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
