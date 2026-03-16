import express from 'express';
import MentalHealthResource from '../models/MentalHealthResource.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all mental health resources
router.get('/', auth, async (req, res) => {
  try {
    const resources = await MentalHealthResource.find();
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create mental health resource (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admin can add mental health resources' });
  try {
    const newResource = new MentalHealthResource(req.body);
    const resource = await newResource.save();
    res.json(resource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
