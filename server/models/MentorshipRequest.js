import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  message: String,
  scheduledTime: Date
}, { timestamps: true });

export default mongoose.model('MentorshipRequest', requestSchema);
