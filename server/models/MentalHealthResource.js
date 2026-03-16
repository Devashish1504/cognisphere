import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, enum: ['stress_management', 'mindfulness', 'crisis_support', 'wellness_library'] },
  type: { type: String, enum: ['article', 'video', 'guide'] },
  content: String,
  url: String
}, { timestamps: true });

export default mongoose.model('MentalHealthResource', resourceSchema);
