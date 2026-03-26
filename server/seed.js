import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users (Optional - uncomment if you want a clean start)
    // await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'System Admin',
        email: 'admin@cognisphere.com',
        password,
        role: 'admin',
        bio: 'Platform Administrator',
      },
      {
        name: 'Dr. Mukunth',
        email: 'mentor@cognisphere.com',
        password,
        role: 'mentor',
        bio: 'Senior Mentor & AI Specialist',
      },
      {
        name: 'Test Student',
        email: 'student@cognisphere.com',
        password,
        role: 'student',
        bio: 'Learning and Growing',
      }
    ];

    for (let u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
        console.log(`Created ${u.role}: ${u.email}`);
      } else {
        console.log(`User ${u.email} already exists.`);
      }
    }

    console.log('✅ Seeding completed! You can now log in with "password123" for any account.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedUsers();
