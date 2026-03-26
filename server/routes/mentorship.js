import express from 'express';
import MentorshipRequest from '../models/MentorshipRequest.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get mentors
router.get('/mentors', auth, async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor', approved: { $ne: false } }).select('-password');
    res.json(mentors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create mentorship request (with optional scheduled time)
router.post('/request', auth, async (req, res) => {
  try {
    const { mentorId, message, scheduledTime } = req.body;
    const mentorshipRequest = new MentorshipRequest({
      studentId: req.user.id,
      mentorId,
      message,
      scheduledTime: scheduledTime || null,
      status: 'pending'
    });

    await mentorshipRequest.save();

    // Notify the mentor of the new request
    const student = await User.findById(req.user.id).select('name');
    await new Notification({
      userId: mentorId,
      message: `${student?.name || 'A student'} sent you a mentorship request`,
      type: 'new-request',
      link: '/mentor'
    }).save();

    res.json(mentorshipRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Accept or reject a mentorship request (mentor only)
router.put('/request/:id', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const request = await MentorshipRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Only the assigned mentor can accept/reject
    if (request.mentorId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized — only the assigned mentor can update this request' });
    }

    request.status = status;
    if (notes) request.notes = notes;
    await request.save();

    // Notify the student about the decision
    const mentor = await User.findById(req.user.id).select('name');
    const mentorName = mentor?.name || 'Your mentor';
    await new Notification({
      userId: request.studentId,
      message: status === 'accepted'
        ? `🎉 ${mentorName} accepted your mentorship request!`
        : `${mentorName} declined your mentorship request.`,
      type: status === 'accepted' ? 'session-accepted' : 'session-rejected',
      link: '/student/mentorship'
    }).save();

    const populated = await MentorshipRequest.findById(request._id)
      .populate('studentId', 'name email avatar')
      .populate('mentorId', 'name email');

    res.json(populated);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add notes to a session (mentor only)
router.put('/request/:id/notes', auth, async (req, res) => {
  try {
    const { notes } = req.body;
    const request = await MentorshipRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.mentorId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    request.notes = notes;
    await request.save();
    res.json(request);
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
      requests = await MentorshipRequest.find({ mentorId: req.user.id })
        .populate('studentId', 'name email avatar department institution')
        .sort({ createdAt: -1 });
    } else {
      requests = await MentorshipRequest.find({ studentId: req.user.id })
        .populate('mentorId', 'name email profile department institution skills')
        .sort({ createdAt: -1 });
    }
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
