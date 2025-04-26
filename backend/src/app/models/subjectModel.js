import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  courseMaterials: {
    syllabus: {
      title: { type: String },
      content: { type: String },
      sections: [{
        title: { type: String },
        weeks: { type: String },
        chapters: [{
          title: { type: String },
          subtopics: [{ type: String }]
        }]
      }]
    },
    lectures: [{
      id: { type: String },
      title: { type: String },
      date: { type: String },
      content: { type: String },
      attachments: [{ type: String }]
    }],
    readings: [{
      id: { type: String },
      title: { type: String },
      author: { type: String },
      type: { type: String },
      chapters: { type: String },
      source: { type: String },
      length: { type: String }
    }],
    assignments: [{
      id: { type: String },
      title: { type: String },
      dueDate: { type: String },
      points: { type: Number },
      instructions: { type: String }
    }]
  },
  notes: [{
    id: { type: String },
    title: { type: String },
    date: { type: String },
    content: { type: String },
    tags: [{ type: String }],
    highlights: [{
      text: { type: String },
      color: { type: String }
    }],
    hasImages: { type: Boolean, default: false },
    imageDescriptions: [{ type: String }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
subjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better query performance
subjectSchema.index({ user: 1 });
subjectSchema.index({ name: 1 });
subjectSchema.index({ isFavorite: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;

