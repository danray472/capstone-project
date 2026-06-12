const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
workerProfileSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
