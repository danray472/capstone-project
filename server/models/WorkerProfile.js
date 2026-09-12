const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: [true, 'Please provide a profession'],
    trim: true,
  },
  bio: {
    type: String,
    required: [true, 'Please provide a bio'],
    trim: true,
    maxlength: 500,
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    trim: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience'],
    min: 0,
  },
  profilePhoto: {
    type: String,
    default: '',
  },
  idNumber: {
    type: String,
    default: '',
    trim: true,
  },
  idDocument: {
    type: String,
    default: '',
  },
  documents: [
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      url: {
        type: String,
        required: true,
      },
      fileType: {
        type: String,
        default: 'document',
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0,
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

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
