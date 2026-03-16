import express from 'express';
import Task from '../models/Task.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;
    const newTask = new Task({
      title,
      description,
      deadline,
      studentId: req.user.id
      // priority isn't in schema, but could be added later if needed
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.studentId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.studentId.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
