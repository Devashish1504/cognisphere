import express from 'express';
import MentalHealthResource from '../models/MentalHealthResource.js';
import MentalHealthAssessment from '../models/MentalHealthAssessment.js';
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

// Submit a mental health assessment
router.post('/assessment', auth, async (req, res) => {
  try {
    const { answers, totalScore } = req.body;
    
    // Determine level based on PHQ-9 scoring
    let level;
    if (totalScore <= 4) level = 'minimal';
    else if (totalScore <= 9) level = 'mild';
    else if (totalScore <= 14) level = 'moderate';
    else if (totalScore <= 19) level = 'moderately_severe';
    else level = 'severe';

    const assessment = new MentalHealthAssessment({
      user: req.user.id,
      answers,
      totalScore,
      level
    });

    await assessment.save();
    res.json(assessment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user's assessment history
router.get('/assessments', auth, async (req, res) => {
  try {
    const assessments = await MentalHealthAssessment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(assessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get latest assessment
router.get('/assessment/latest', auth, async (req, res) => {
  try {
    const assessment = await MentalHealthAssessment.findOne({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(assessment || null);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
