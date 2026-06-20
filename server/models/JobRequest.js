const mongoose = require('mongoose');

const jobRequestSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  workerId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a job description'],
    trim: true,
    maxlength: 1000,
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true,
  },
  locationCoordinates: {
    lat: {
      type: Number,
      default: null,
    },
    lng: {
      type: Number,
      default: null,
    },
  },
  clientContact: {
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobRequest', jobRequestSchema);
