import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import resourceRoutes from './routes/resources.js';
import mentalHealthRoutes from './routes/mentalhealth.js';
import mentorshipRoutes from './routes/mentorship.js';

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

// Basic route
app.get('/', (req, res) => {
  res.send('CogniSphere API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
