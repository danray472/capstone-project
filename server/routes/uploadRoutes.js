const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage, documentStorage, isCloudinaryConfigured } = require('../config/cloudinary');

const upload = multer({ storage: storage || multer.memoryStorage() });
const uploadDocument = multer({ storage: documentStorage || multer.memoryStorage() });

const requireCloudinaryConfig = (res) => {
  if (!isCloudinaryConfigured()) {
    return res.status(500).json({
      message: 'Cloudinary is not configured on this server. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.'
    });
  }
  return null;
};

// @route   POST /api/upload/image
// @desc    Upload image to Cloudinary
// @access  Public
router.post('/image', (req, res, next) => {
  const cloudinaryError = requireCloudinaryConfig(res);
  if (cloudinaryError) return;

  upload.single('image')(req, res, next);
}, (req, res) => {
  console.log('[Upload] Request received');
  console.log('[Upload] File:', req.file);

  if (!req.file) {
    console.log('[Upload] No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('[Upload] Upload successful:', req.file.path);
  res.json({
    url: req.file.path,
    publicId: req.file.filename,
  });
});

// @route   POST /api/upload/document
// @desc    Upload supportive document or scanned ID (PDF, JPG, PNG, WEBP)
// @access  Public
router.post('/document', (req, res, next) => {
  const cloudinaryError = requireCloudinaryConfig(res);
  if (cloudinaryError) return;

  uploadDocument.single('document')(req, res, next);
}, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No document file uploaded' });
  }

  res.json({
    url: req.file.path,
    publicId: req.file.filename,
    originalName: req.file.originalname,
    format: req.file.format,
  });
});

// Error handler for multer
router.use((error, req, res, next) => {
  console.error('[Upload] Error:', error);
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: error.message || 'Upload failed' });
});

module.exports = router;
