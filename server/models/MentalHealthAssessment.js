import mongoose from 'mongoose';

const mentalHealthAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionIndex: Number,
    score: Number
  }],
  totalScore: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    default: 27
  },
  level: {
    type: String,
    enum: ['minimal', 'mild', 'moderate', 'moderately_severe', 'severe'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const MentalHealthAssessment = mongoose.model('MentalHealthAssessment', mentalHealthAssessmentSchema);
export default MentalHealthAssessment;
