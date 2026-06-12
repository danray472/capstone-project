// @desc    Test API endpoint
// @route   GET /api/test
// @access  Public
const testAPI = (req, res) => {
  res.json({ message: 'Backend Running' });
};

module.exports = { testAPI };
