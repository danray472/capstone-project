const mongoose = require('mongoose');
const dns = require('dns');

// Set Google's DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Prioritize IPv4 resolution to prevent ECONNREFUSED when querying MongoDB SRV records
dns.setDefaultResultOrder('ipv4first');


const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://danray472:danray472@dseproject.csx9lbj.mongodb.net/?appName=DseProject';
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Backend is running, but database connection failed. Please ensure MongoDB is started.');
  }
};

module.exports = connectDB;
