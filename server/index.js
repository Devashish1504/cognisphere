import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import resourceRoutes from './routes/resources.js';
import mentalHealthRoutes from './routes/mentalhealth.js';
import mentorshipRoutes from './routes/mentorship.js';

dotenv.config();

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

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cognisphere')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('CogniSphere API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
