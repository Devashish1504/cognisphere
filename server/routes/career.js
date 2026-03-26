import express from 'express';
import CareerAssessment from '../models/CareerAssessment.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user's career assessments
router.get('/', auth, async (req, res) => {
  try {
    const assessments = await CareerAssessment.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(assessments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Submit a career assessment and get recommendations
router.post('/submit', auth, async (req, res) => {
  try {
    const { scores } = req.body;
    
    // Logic to recommend pathways based on scores
    const pathways = [];
    
    if (scores.technical >= 70) {
      pathways.push({
        title: 'Full Stack Developer',
        match: Math.min(scores.technical + 10, 98),
        description: 'Design and build complex web applications using modern frameworks.',
        category: 'Engineering',
        color: 'from-blue-500 to-indigo-600'
      });
    }
    
    if (scores.analytical >= 75) {
      pathways.push({
        title: 'Data Scientist',
        match: Math.min(scores.analytical + 5, 95),
        description: 'Leverage data to solve business problems and build predictive models.',
        category: 'Science',
        color: 'from-purple-500 to-pink-600'
      });
    }
    
    if (scores.creative >= 70 && scores.technical >= 50) {
      pathways.push({
        title: 'UI/UX Architect',
        match: Math.round((scores.creative + scores.technical) / 2),
        description: 'Craft beautiful and functional user experiences for digital products.',
        category: 'Design',
        color: 'from-emerald-500 to-teal-600'
      });
    }

    if (scores.leadership >= 70) {
      pathways.push({
        title: 'Product Manager',
        match: scores.leadership,
        description: 'Lead product visions and bridge the gap between business and tech.',
        category: 'Business',
        color: 'from-amber-500 to-orange-600'
      });
    }

    // Default if no high scores
    if (pathways.length === 0) {
      pathways.push({
        title: 'Business Analyst',
        match: 70,
        description: 'Interpreting data and helping businesses make better decisions.',
        category: 'Consulting',
        color: 'from-slate-500 to-slate-700'
      });
    }

    const assessment = new CareerAssessment({
      user: req.user.id,
      scores,
      recommendedPathways: pathways,
      status: 'Completed',
      completedAt: new Date()
    });

    await assessment.save();
    res.json(assessment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
