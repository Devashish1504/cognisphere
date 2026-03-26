import express from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';
import MentorshipRequest from '../models/MentorshipRequest.js';
import MentalHealthAssessment from '../models/MentalHealthAssessment.js';
import Notification from '../models/Notification.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Middleware: admin only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

// ============================
// ADMIN DASHBOARD STATS
// ============================
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    const acceptedSessions = await MentorshipRequest.countDocuments({ status: 'accepted' });
    const pendingSessions = await MentorshipRequest.countDocuments({ status: 'pending' });
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    
    // Assessments this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const weeklyAssessments = await MentalHealthAssessment.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    // Pending mentor approvals
    const pendingMentors = await User.find({ role: 'mentor', approved: false })
      .select('name email department institution createdAt')
      .sort({ createdAt: -1 });

    // Recent registrations (last 10)
    const recentUsers = await User.find()
      .select('name email role createdAt approved')
      .sort({ createdAt: -1 })
      .limit(10);

    // Monthly user growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalStudents,
        totalMentors,
        totalAdmins,
        acceptedSessions,
        pendingSessions,
        totalTasks,
        completedTasks,
        weeklyAssessments
      },
      pendingMentors,
      recentUsers,
      monthlyGrowth
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ============================
// MENTOR APPROVAL
// ============================

// Approve a mentor
router.put('/mentor/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id);
    if (!mentor) return res.status(404).json({ message: 'User not found' });
    if (mentor.role !== 'mentor') return res.status(400).json({ message: 'User is not a mentor' });

    mentor.approved = true;
    await mentor.save();

    // Notify the mentor
    await new Notification({
      userId: mentor._id,
      message: '🎉 You have been approved as a mentor! Students can now book sessions with you.',
      type: 'mentor-approved',
      link: '/mentor'
    }).save();

    res.json({ message: 'Mentor approved', mentor: { id: mentor._id, name: mentor.name, email: mentor.email, approved: true } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Reject a mentor
router.put('/mentor/:id/reject', auth, adminOnly, async (req, res) => {
  try {
    const mentor = await User.findById(req.params.id);
    if (!mentor) return res.status(404).json({ message: 'User not found' });
    if (mentor.role !== 'mentor') return res.status(400).json({ message: 'User is not a mentor' });

    // Set approved to false (or delete — here we keep the account but unapproved)
    mentor.approved = false;
    await mentor.save();

    await new Notification({
      userId: mentor._id,
      message: 'Your mentor application was not approved. Contact support for more details.',
      type: 'general'
    }).save();

    res.json({ message: 'Mentor rejected', mentor: { id: mentor._id, name: mentor.name } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ============================
// USER MANAGEMENT
// ============================

// Get all users (paginated)
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const role = req.query.role;
    
    const filter = role ? { role } : {};
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('name email role approved createdAt department institution')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a user
router.delete('/user/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin accounts' });
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
