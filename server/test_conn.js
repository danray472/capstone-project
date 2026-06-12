const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Set Google's DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Fix for Node.js SRV resolution issue on Windows
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

console.log('Attempting connection to MongoDB Atlas (srv with DNS fix)...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILURE: Connection failed with error:', err.message);
    process.exit(1);
  });
