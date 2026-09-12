const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Set Google's DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Prioritize IPv4 resolution to prevent ECONNREFUSED when querying MongoDB SRV records
dns.setDefaultResultOrder('ipv4first');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://danray472:danray472@dseproject.csx9lbj.mongodb.net/?appName=DseProject';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Make a user admin
const makeAdmin = async (email) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email '${email}' not found`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`User '${email}' is already an admin`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ User '${email}' has been successfully upgraded to admin role`);
    console.log(`User details:`, {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/makeAdmin.js <user-email>');
  console.log('Example: node scripts/makeAdmin.js john@example.com');
  process.exit(1);
}

makeAdmin(email);
