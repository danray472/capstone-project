const express = require('express');
const router = express.Router();
const { testAPI } = require('../controllers/testController');

// GET /api/test
router.get('/', testAPI);

module.exports = router;
