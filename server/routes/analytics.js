import express from 'express';
import Task from '../models/Task.js';
import MentalHealthAssessment from '../models/MentalHealthAssessment.js';
import MentorshipRequest from '../models/MentorshipRequest.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get real analytics data for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Task stats
    const allTasks = await Task.find({ user: userId });
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const pendingTasks = allTasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
    
    // Tasks completed per day this week (Mon-Sun)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weeklyTasks = await Task.find({
      user: userId,
      createdAt: { $gte: startOfWeek }
    });
    
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyActivity = dayNames.map((day, idx) => {
      const dayStart = new Date(startOfWeek);
      dayStart.setDate(startOfWeek.getDate() + idx);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      
      const tasksOnDay = weeklyTasks.filter(t => {
        const d = new Date(t.createdAt);
        return d >= dayStart && d < dayEnd;
      });
      return { day, count: tasksOnDay.length };
    });

    // Mentorship stats
    const mentorshipRequests = await MentorshipRequest.find({ studentId: userId });
    const acceptedMentorships = mentorshipRequests.filter(r => r.status === 'accepted');

    // Mental health history
    const assessments = await MentalHealthAssessment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Compute category breakdown from tasks
    const categoryMap = {};
    allTasks.forEach(t => {
      const cat = t.category || 'General';
      if (!categoryMap[cat]) categoryMap[cat] = { total: 0, completed: 0 };
      categoryMap[cat].total++;
      if (t.status === 'completed') categoryMap[cat].completed++;
    });

    const categories = Object.entries(categoryMap).map(([name, data]) => ({
      name,
      total: data.total,
      completed: data.completed,
      progress: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
    }));

    res.json({
      stats: {
        totalTasks: allTasks.length,
        completedTasks: completedTasks.length,
        pendingTasks: pendingTasks.length,
        mentorshipRequests: mentorshipRequests.length,
        acceptedMentorships: acceptedMentorships.length,
        assessmentsTaken: assessments.length
      },
      weeklyActivity,
      categories,
      assessments: assessments.map(a => ({
        score: a.totalScore,
        level: a.level,
        date: a.createdAt
      })),
      joinedDate: req.user.createdAt || new Date()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
