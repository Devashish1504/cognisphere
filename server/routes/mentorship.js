import express from 'express';
import MentorshipRequest from '../models/MentorshipRequest.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get mentors
router.get('/mentors', auth, async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    res.json(mentors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create mentorship request
router.post('/request', auth, async (req, res) => {
  try {
    const { mentorId, message } = req.body;
    const mentorshipRequest = new MentorshipRequest({
      studentId: req.user.id,
      mentorId,
      message,
      status: 'pending'
    });

    await mentorshipRequest.save();
    res.json(mentorshipRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get requests for mentor/student
router.get('/requests', auth, async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'mentor') {
      requests = await MentorshipRequest.find({ mentorId: req.user.id }).populate('studentId', 'name email');
    } else {
      requests = await MentorshipRequest.find({ studentId: req.user.id }).populate('mentorId', 'name email profile');
    }
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
