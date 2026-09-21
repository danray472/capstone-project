const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage, documentStorage, isCloudinaryConfigured } = require('../config/cloudinary');

const upload = multer({ storage: storage || multer.memoryStorage() });
const uploadDocument = multer({ storage: documentStorage || multer.memoryStorage() });

const normalizeDocumentUrl = (file) => {
  if (!file || !file.path) return file?.path || '';

  const url = file.path;
  const isPdfLike = /\.(pdf)(\?|$)/i.test(url) || file.format === 'pdf' || file.mimetype === 'application/pdf';

  if (isPdfLike && url.includes('/image/upload/')) {
    return url.replace('/image/upload/', '/raw/upload/');
  }

  return url;
};

const getDownloadFilename = (url, fallback = 'document') => {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    const rawName = decodeURIComponent(parts[parts.length - 1] || '');
    if (rawName && rawName.includes('.')) return rawName;
  } catch (error) {
    // Ignore invalid URLs and use fallback.
  }

  return fallback;
};

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

  const normalizedUrl = normalizeDocumentUrl(req.file);

  res.json({
    url: normalizedUrl,
    publicId: req.file.filename,
    originalName: req.file.originalname,
    format: req.file.format,
    resourceType: req.file.resource_type || (req.file.format === 'pdf' ? 'raw' : 'image'),
  });
});

// @route   GET /api/upload/document/download
// @desc    Force document downloads instead of inline browser viewing
// @access  Public
router.get('/document/download', async (req, res) => {
  const fileUrl = req.query.url;

  if (!fileUrl) {
    return res.status(400).json({ message: 'Missing document URL to download.' });
  }

  try {
    const sourceUrl = decodeURIComponent(String(fileUrl));
    const response = await fetch(sourceUrl);

    if (!response.ok) {
      return res.status(502).json({ message: 'Failed to fetch document for download.' });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const filename = getDownloadFilename(sourceUrl, 'document.pdf');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-store');

    if (response.body) {
      return response.body.pipe(res);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return res.send(buffer);
  } catch (error) {
    console.error('[Upload] Download error:', error);
    return res.status(500).json({ message: 'Unable to download document.' });
  }
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
