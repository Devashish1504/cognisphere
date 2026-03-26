import express from 'express';
import MentorshipRequest from '../models/MentorshipRequest.js';
import Availability from '../models/Availability.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ============================
// MENTOR DASHBOARD STATS
// ============================
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Mentor access only' });
    }

    const mentorId = req.user.id;

    // Pending requests
    const pendingRequests = await MentorshipRequest.find({
      mentorId,
      status: 'pending'
    }).populate('studentId', 'name email department institution avatar');

    // Accepted sessions (active students)
    const acceptedSessions = await MentorshipRequest.find({
      mentorId,
      status: 'accepted'
    }).populate('studentId', 'name email department institution avatar');

    // Rejected sessions
    const rejectedSessions = await MentorshipRequest.find({
      mentorId,
      status: 'rejected'
    });

    // Unique student roster (students with at least one accepted request)
    const studentMap = new Map();
    acceptedSessions.forEach(s => {
      if (s.studentId && !studentMap.has(s.studentId._id.toString())) {
        studentMap.set(s.studentId._id.toString(), s.studentId);
      }
    });
    const studentRoster = Array.from(studentMap.values());

    // Availability slots
    const availability = await Availability.find({ mentorId });

    // Session history (accepted sessions with date info)
    const sessionHistory = await MentorshipRequest.find({
      mentorId,
      status: 'accepted'
    })
      .populate('studentId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      stats: {
        pendingCount: pendingRequests.length,
        acceptedCount: acceptedSessions.length,
        rejectedCount: rejectedSessions.length,
        totalStudents: studentRoster.length,
        availabilitySlots: availability.length
      },
      pendingRequests,
      studentRoster,
      sessionHistory,
      availability
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ============================
// AVAILABILITY MANAGEMENT
// ============================

// Get mentor's availability
router.get('/availability', auth, async (req, res) => {
  try {
    const mentorId = req.user.id;
    const slots = await Availability.find({ mentorId }).sort({ day: 1 });
    res.json(slots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a specific mentor's availability (for students)
router.get('/availability/:mentorId', auth, async (req, res) => {
  try {
    const slots = await Availability.find({ mentorId: req.params.mentorId }).sort({ day: 1 });
    res.json(slots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add an availability slot
router.post('/availability', auth, async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Mentor access only' });
    }

    const { day, startTime, endTime } = req.body;

    const slot = new Availability({
      mentorId: req.user.id,
      day,
      startTime,
      endTime
    });

    await slot.save();
    res.json(slot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an availability slot
router.delete('/availability/:id', auth, async (req, res) => {
  try {
    const slot = await Availability.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.mentorId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Availability.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slot removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
