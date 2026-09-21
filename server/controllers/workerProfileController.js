const mongoose = require('mongoose');
const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');

// @desc    Create worker profile (or update if already exists)
// @route   POST /api/profiles
// @access  Private
const createProfile = async (req, res) => {
  try {
    const {
      userId,
      profession,
      bio,
      location,
      phone,
      skills,
      experience,
      profilePhoto,
      idNumber,
      idDocument,
      documents,
    } = req.body;

    // Use authenticated userId or fallback from request body
    const finalUserId = (req.userId ? req.userId.toString() : '') || (userId ? userId.toString() : '');

    if (!finalUserId) {
      return res.status(400).json({ message: 'User ID is required to create a profile' });
    }

    // Resolve idNumber: use provided or fallback to User record
    let resolvedIdNumber = idNumber ? idNumber.trim() : '';
    if (!resolvedIdNumber) {
      const user = await User.findById(finalUserId);
      if (user && user.idNumber) {
        resolvedIdNumber = user.idNumber;
      }
    }

    // Check if profile already exists for this user - if so, update it seamlessly
    let profile = await WorkerProfile.findOne({
      $or: [
        { userId: finalUserId },
        ...(req.userId ? [{ userId: req.userId }] : [])
      ]
    });

    if (profile) {
      if (profession !== undefined) profile.profession = profession;
      if (bio !== undefined) profile.bio = bio;
      if (location !== undefined) profile.location = location;
      if (phone !== undefined) profile.phone = phone;
      if (skills !== undefined) profile.skills = skills;
      if (experience !== undefined) profile.experience = experience;
      if (profilePhoto !== undefined) profile.profilePhoto = profilePhoto;
      if (resolvedIdNumber) profile.idNumber = resolvedIdNumber;
      if (idDocument !== undefined) profile.idDocument = idDocument;
      if (documents !== undefined) profile.documents = Array.isArray(documents) ? documents : profile.documents;
      profile.updatedAt = Date.now();

      await profile.save();

      if (resolvedIdNumber) {
        await User.findByIdAndUpdate(finalUserId, { idNumber: resolvedIdNumber });
      }

      return res.status(200).json(profile);
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
      idNumber: resolvedIdNumber,
      idDocument: idDocument || '',
      documents: Array.isArray(documents) ? documents : [],
    };

    profile = await WorkerProfile.create(profileData);

    if (resolvedIdNumber) {
      await User.findByIdAndUpdate(finalUserId, { idNumber: resolvedIdNumber });
    }

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
    const {
      userId,
      profession,
      bio,
      location,
      phone,
      skills,
      experience,
      profilePhoto,
      idNumber,
      idDocument,
      documents,
    } = req.body;

    // Use authenticated userId or fallback from request body / query
    const targetUserId = (req.userId ? req.userId.toString() : '') ||
                         (userId ? userId.toString() : '') ||
                         (req.query?.userId ? req.query.userId.toString() : '');

    if (!targetUserId && !req.body._id) {
      return res.status(400).json({ message: 'User ID or Profile ID is required to update profile' });
    }

    // Locate existing profile
    let profile = null;
    if (targetUserId) {
      profile = await WorkerProfile.findOne({
        $or: [
          { userId: targetUserId },
          ...(req.userId ? [{ userId: req.userId }] : [])
        ]
      });
    }

    if (!profile && req.body._id && mongoose.Types.ObjectId.isValid(req.body._id)) {
      profile = await WorkerProfile.findById(req.body._id);
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (profession !== undefined) profile.profession = profession;
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (phone !== undefined) profile.phone = phone;
    if (skills !== undefined) profile.skills = skills;
    if (experience !== undefined) profile.experience = experience;
    if (profilePhoto !== undefined) profile.profilePhoto = profilePhoto;
    if (idNumber !== undefined) profile.idNumber = idNumber ? idNumber.trim() : '';
    if (idDocument !== undefined) profile.idDocument = idDocument;
    if (documents !== undefined) profile.documents = Array.isArray(documents) ? documents : profile.documents;
    profile.updatedAt = Date.now();

    await profile.save();

    // If idNumber was provided, synchronize it to the User account as well
    if (idNumber && idNumber.trim()) {
      const userLookupId = targetUserId || profile.userId;
      if (userLookupId) {
        await User.findByIdAndUpdate(userLookupId, { idNumber: idNumber.trim() });
      }
    }

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
    // Get userId from authenticated request or query param
    const userId = (req.userId ? req.userId.toString() : '') ||
                   (req.query?.userId ? req.query.userId.toString() : '');

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId).select('fullName email idNumber');

    const profile = await WorkerProfile.findOne({
      $or: [
        { userId: userId },
        ...(req.userId ? [{ userId: req.userId }] : [])
      ]
    });

    if (!profile) {
      return res.status(200).json({
        profile: null,
        message: 'Profile not found for this user',
        userData: user,
      });
    }

    res.json({
      ...profile.toObject(),
      userData: user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get profile by ID (or userId)
// @route   GET /api/profiles/:id
// @access  Public
const getProfileById = async (req, res) => {
  try {
    let profile = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      profile = await WorkerProfile.findById(req.params.id);
    }

    if (!profile) {
      profile = await WorkerProfile.findOne({ userId: req.params.id });
    }
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Fetch user data to get fullName and idNumber
    const user = await User.findById(profile.userId).select('fullName email idNumber');

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
    const profilesWithUserData = await Promise.all(
      profiles.map(async (profile) => {
        const user = await User.findById(profile.userId).select('fullName email idNumber');
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
