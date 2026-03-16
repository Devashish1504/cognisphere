import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizAnswers: [String],
  recommendedFields: [String],
  takenAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('CareerAssessment', assessmentSchema);
