import mongoose from 'mongoose';

const CareerAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Started', 'Draft', 'Completed'],
    default: 'Started'
  },
  scores: {
    technical: { type: Number, default: 0 },
    creative: { type: Number, default: 0 },
    analytical: { type: Number, default: 0 },
    leadership: { type: Number, default: 0 },
    interpersonal: { type: Number, default: 0 }
  },
  recommendedPathways: [{
    title: String,
    match: Number,
    description: String,
    category: String,
    color: String
  }],
  summary: String,
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('CareerAssessment', CareerAssessmentSchema);
