const JobRequest = require('../models/JobRequest');

// @desc    Create job request
// @route   POST /api/requests
// @access  Private (temporarily removed for testing)
const createJobRequest = async (req, res) => {
  try {
    const { clientId, workerId, description, location, locationCoordinates, clientContact } = req.body;

    const jobRequestData = {
      clientId,
      workerId,
      description,
      location,
      locationCoordinates: locationCoordinates || { lat: null, lng: null },
      clientContact: clientContact || { name: '', email: '', phone: '' },
    };

    const jobRequest = await JobRequest.create(jobRequestData);
    res.status(201).json(jobRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update job request status
// @route   PUT /api/requests/:id/status
// @access  Private (temporarily removed for testing)
const updateJobRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const jobRequest = await JobRequest.findById(req.params.id);

    if (!jobRequest) {
      return res.status(404).json({ message: 'Job request not found' });
    }

    jobRequest.status = status;
    await jobRequest.save();
    res.json(jobRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get client's job requests
// @route   GET /api/requests/client/:clientId
// @access  Private (temporarily removed for testing)
const getClientJobRequests = async (req, res) => {
  try {
    const jobRequests = await JobRequest.find({ clientId: req.params.clientId }).sort({ createdAt: -1 });
    res.json(jobRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get worker's job requests
// @route   GET /api/requests/worker/:workerId
// @access  Private (temporarily removed for testing)
const getWorkerJobRequests = async (req, res) => {
  try {
    const jobRequests = await JobRequest.find({ workerId: req.params.workerId }).sort({ createdAt: -1 });
    res.json(jobRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get job request by ID
// @route   GET /api/requests/:id
// @access  Private (temporarily removed for testing)
const getJobRequestById = async (req, res) => {
  try {
    const jobRequest = await JobRequest.findById(req.params.id);

    if (!jobRequest) {
      return res.status(404).json({ message: 'Job request not found' });
    }

    res.json(jobRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createJobRequest,
  updateJobRequestStatus,
  getClientJobRequests,
  getWorkerJobRequests,
  getJobRequestById,
};
