import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const findAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cognisphere');
    const admin = await User.findOne({ role: 'admin' });
    console.log('ADMIN_ID:', admin ? admin._id.toString() : 'NONE');
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

findAdmin();
