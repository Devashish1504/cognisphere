import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a resource title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  url: {
    type: String,
    required: [true, 'Please provide a resource link'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Video', 'PDF', 'Course', 'Tutorial', 'Article'],
    default: 'Video'
  },
  category: {
    type: String,
    enum: ['Programming', 'Design', 'Business', 'Academic', 'Wellness', 'Career', 'Soft Skills'],
    default: 'Programming'
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.5
  },
  duration: {
    type: String,
    default: '10 min'
  },
  bookmarkedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

// Index for full-text search
resourceSchema.index({ title: 'text', description: 'text', category: 'text' });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
