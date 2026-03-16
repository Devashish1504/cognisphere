import express from 'express';
import LearningResource from '../models/LearningResource.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all resources
router.get('/', auth, async (req, res) => {
  try {
    const resources = await LearningResource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Upload a resource (admin/mentor only)
router.post('/', auth, async (req, res) => {
  if (req.user.role === 'student') {
    return res.status(403).json({ message: 'Authorization denied, mentors/admins only' });
  }
  try {
    const { title, description, type, category, url } = req.body;
    const resource = new LearningResource({
      title, description, type, category, url, uploadedBy: req.user.id
    });

    const newResource = await resource.save();
    res.json(newResource);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
