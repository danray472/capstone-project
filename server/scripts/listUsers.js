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

// List all users with their roles
const listUsers = async () => {
  try {
    await connectDB();

    const users = await User.find({}).select('fullName email role createdAt').sort({ createdAt: -1 });

    if (users.length === 0) {
      console.log('No users found in the database');
      process.exit(0);
    }

    console.log('\n=== All Users ===\n');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullName} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt.toISOString()}`);
      console.log(`   ID: ${user._id}`);
      console.log('');
    });

    console.log(`Total users: ${users.length}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

listUsers();
