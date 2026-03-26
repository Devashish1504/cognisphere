import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a goal title']
  },
  target: {
    type: Number,
    required: true,
    default: 10
  },
  current: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'Tasks' // e.g., 'Hours', 'Sessions', 'Tasks'
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Missed'],
    default: 'In Progress'
  }
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
