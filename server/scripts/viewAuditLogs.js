const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
const AuditLog = require('../models/AuditLog');
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

// View audit logs
const viewAuditLogs = async (limit = 10) => {
  try {
    await connectDB();

    const logs = await AuditLog.find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'fullName email role');

    if (logs.length === 0) {
      console.log('No audit logs found in the database');
      process.exit(0);
    }

    console.log('\n=== Recent Audit Logs ===\n');
    logs.forEach((log, index) => {
      console.log(`${index + 1}. ${log.action} - ${log.status}`);
      console.log(`   Timestamp: ${log.timestamp.toISOString()}`);
      console.log(`   User: ${log.userId ? `${log.userId.fullName} (${log.userId.email})` : 'N/A'}`);
      console.log(`   IP Address: ${log.ipAddress || 'N/A'}`);
      console.log(`   Details: ${JSON.stringify(log.details)}`);
      console.log(`   ID: ${log._id}`);
      console.log('');
    });

    console.log(`Total logs shown: ${logs.length}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Get limit from command line argument
const limit = parseInt(process.argv[2]) || 10;

viewAuditLogs(limit);
