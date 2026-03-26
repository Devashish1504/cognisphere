import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resource from './models/Resource.js';
import User from './models/User.js';

dotenv.config();

const resources = [
  {
    title: 'CS50: Introduction to Computer Science',
    description: 'An introduction to the intellectual enterprises of computer science and the art of programming from Harvard University.',
    url: 'https://www.youtube.com/watch?v=8mAITcNt77k',
    type: 'Video',
    category: 'Programming',
    duration: '2h 15m',
    thumbnailUrl: 'https://img.youtube.com/vi/8mAITcNt77k/maxresdefault.jpg',
    rating: 4.9,
    views: 1240
  },
  {
    title: 'Web Dev Simplified: React Hooks',
    description: 'A complete guide to React hooks and how to use them effectively in modern web applications.',
    url: 'https://www.youtube.com/watch?v=O6P86uwfdF0',
    type: 'Video',
    category: 'Programming',
    duration: '15 min',
    thumbnailUrl: 'https://img.youtube.com/vi/O6P86uwfdF0/maxresdefault.jpg',
    rating: 4.8,
    views: 850
  },
  {
    title: 'MIT OCW: Linear Algebra',
    description: 'Comprehensive video series on Linear Algebra by Professor Gilbert Strang from MIT OpenCourseWare.',
    url: 'https://www.youtube.com/playlist?list=PLE7DDD91010BC51F8',
    type: 'Course',
    category: 'Academic',
    duration: '35 Lectures',
    rating: 5.0,
    views: 2100
  },
  {
    title: 'Product Management for Beginners',
    description: 'Learn the fundamentals of product management, from discovery to delivery.',
    url: 'https://www.coursera.org/learn/product-management',
    type: 'Course',
    category: 'Business',
    duration: '12h total',
    rating: 4.6,
    views: 540
  },
  {
    title: 'Google Career Certificates: Resume Tips',
    description: 'Official guide from Google on how to build a resume that stands out to recruiters.',
    url: 'https://grow.google/certificates/resume-guide/',
    type: 'Article',
    category: 'Career',
    duration: '5 min read',
    rating: 4.7,
    views: 3200
  },
  {
    title: 'The Art of Effective Communication',
    description: 'Master the skills required for public speaking, workplace collaboration, and interpersonal influence.',
    url: 'https://www.edx.org/course/effective-communication',
    type: 'Tutorial',
    category: 'Soft Skills',
    duration: '4h total',
    rating: 4.5,
    views: 920
  },
  {
    title: 'Daily Mindfulness Practice',
    description: 'A guided meditation and mindfulness session to reduce academic stress and improve focus.',
    url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    type: 'Video',
    category: 'Wellness',
    duration: '10 min',
    thumbnailUrl: 'https://img.youtube.com/vi/inpok4MKVLM/maxresdefault.jpg',
    rating: 4.9,
    views: 1540
  }
];

const seedResources = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cognisphere');
    
    // Find an admin or mentor to be the uploader
    const uploader = await User.findOne({ role: { $in: ['admin', 'mentor'] } });
    
    if (!uploader) {
      console.log('Error: No admin or mentor found to associate with seed data.');
      process.exit(1);
    }

    // Clear existing resources
    await Resource.deleteMany({});
    
    const resourcesWithUploader = resources.map(res => ({
      ...res,
      uploadedBy: uploader._id
    }));

    await Resource.insertMany(resourcesWithUploader);
    
    console.log(`Successfully seeded ${resources.length} high-quality resources!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding resources:', err);
    process.exit(1);
  }
};

seedResources();
