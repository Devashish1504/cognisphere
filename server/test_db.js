import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Force Node.js to use IPv4 first (fixes ECONNREFUSED on some networks)
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

console.log('Connecting to MongoDB Atlas...');

mongoose.connect(process.env.MONGO_URI)
  .then((conn) => {
    console.log('🚀 MongoDB Connected: ' + conn.connection.host);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
