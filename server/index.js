import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import resourceRoutes from './routes/resources.js';
import mentalHealthRoutes from './routes/mentalhealth.js';
import mentorshipRoutes from './routes/mentorship.js';
import careerRoutes from './routes/career.js';
import analyticsRoutes from './routes/analytics.js';
import mentorRoutes from './routes/mentor.js';
import notificationRoutes from './routes/notifications.js';
import adminRoutes from './routes/admin.js';
import postRoutes from './routes/posts.js';
import goalRoutes from './routes/goals.js';
import careerRoutes from './routes/career.js';

import connectDB from './config/db.js';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/mentalhealth', mentalHealthRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/career', careerRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('CogniSphere API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
