const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');

const upload = multer({ storage });

// @route   POST /api/upload/image
// @desc    Upload image to Cloudinary
// @access  Public
router.post('/image', upload.single('image'), (req, res) => {
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

// Error handler for multer
router.use((error, req, res, next) => {
  console.error('[Upload] Error:', error);
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: error.message || 'Upload failed' });
});

module.exports = router;
