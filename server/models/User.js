const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['client', 'worker'],
    default: 'client',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
