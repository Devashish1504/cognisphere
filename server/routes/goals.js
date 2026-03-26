import express from 'express';
import Goal from '../models/Goal.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/goals
// @desc    Get all goals for the logged-in student
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, target, unit, deadline } = req.body;
    
    if (!title || !target || !deadline) {
      return res.status(400).json({ message: 'Title, target, and deadline are required' });
    }

    const newGoal = new Goal({
      user: req.user.id,
      title,
      target,
      unit,
      deadline
    });

    const goal = await newGoal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/goals/:id/increment
// @desc    Increment goal progress
// @access  Private
router.put('/:id/increment', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    
    // Check ownership
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    goal.current += 1;
    if (goal.current >= goal.target) {
      goal.status = 'Completed';
    }
    
    await goal.save();
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
