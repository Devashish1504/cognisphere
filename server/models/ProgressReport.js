import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studyHours: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  resourcesViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LearningResource' }],
  weekStartDate: Date,
  weekEndDate: Date
}, { timestamps: true });

export default mongoose.model('ProgressReport', reportSchema);
