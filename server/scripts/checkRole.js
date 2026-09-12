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

// Check user role
const checkRole = async (email) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`❌ User with email '${email}' not found`);
      process.exit(1);
    }

    console.log('\n=== User Role Check ===\n');
    console.log(`Name: ${user.fullName}`);
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log(`ID: ${user._id}`);
    console.log(`Created: ${user.createdAt.toISOString()}`);
    
    if (user.role === 'admin') {
      console.log('\n✅ This user has ADMIN privileges');
    } else {
      console.log('\n❌ This user does NOT have admin privileges');
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/checkRole.js <user-email>');
  console.log('Example: node scripts/checkRole.js john@example.com');
  process.exit(1);
}

checkRole(email);
