const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  workerId: {
    type: String,
    required: true,
  },
  jobRequestId: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    trim: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
