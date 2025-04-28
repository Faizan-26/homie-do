// filepath: d:\Study\Sem 6\web\homie-do\backend\src\app\models\subjectModel.js
import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },

  courseMaterials: {
    syllabus: {
      title: { type: String },
      content: { type: String },
      units: [{
        // Removed explicit id field to use MongoDB's _id
        title: { type: String, required: true },
        weeks: { type: Number }, // Changed from String to Number
        chapters: [{
          // Removed explicit id field to use MongoDB's _id
          title: { type: String, required: true },
          subtopics: [String] // contains an array of subtopics as strings
        }]
      }]
    },
    lectures: [{
      // Removed explicit id field to use MongoDB's _id
      title: { type: String },
      date: { type: Date, default: Date.now }, // Changed from String to Date
      content: { type: String },
      attachments: [{
        // Removed explicit id field to use MongoDB's _id
        name: { type: String }, // name of the file
        type: { type: String }, // pdf, doc, etc.
        size: { type: Number }, // size in bytes
        url: { type: String }  // CLOUDINARY URL
      }]
    }],
    readings: [{
      // Removed explicit id field to use MongoDB's _id
      title: { type: String },
      type: { type: String }, // TEXTBOOK, ARTICLE, VIDEO, etc.
      typeFieldOne: { type: String },
      typeFieldTwo: { type: String },
      attachments: [{
        // Removed explicit id field to use MongoDB's _id
        name: { type: String }, // name of the file
        type: { type: String }, // pdf, doc, etc.
        size: { type: Number }, // size in bytes
        url: { type: String }  // CLOUDINARY URL
      }]
    }],
    assignments: [{
      // Removed explicit id field to use MongoDB's _id
      title: { type: String },
      dueDate: { type: Date }, // Changed from String to Date
      points: { type: Number },
      instructions: { type: String },
      isCompleted: { type: Boolean, default: false },
      isFavorite: { type: Boolean, default: false },
      attachments: [{
        // Removed explicit id field to use MongoDB's _id
        name: { type: String }, // name of the file
        type: { type: String }, // pdf, doc, etc.
        size: { type: Number }, // size in bytes
        url: { type: String }  // CLOUDINARY URL
      }]
    }]
  },
  notes: [{
    // Removed explicit id field to use MongoDB's _id
    title: { type: String },
    date: { type: Date, default: Date.now }, // Changed from String to Date
    content: { type: String },
    tags: [{ type: String }]
  }]
}, { 
  timestamps: true // This automatically manages createdAt and updatedAt
});

// Single toJSON transform method - removed the redundant second one
subjectSchema.set('toJSON', {
  virtuals: true,           // expose virtuals (like "id")
  transform: (doc, ret) => {
    ret.id = ret._id.toString();  // copy `_id` → `id`
    delete ret._id;               // drop the ObjectID
    delete ret.__v;               // drop the version key
    return ret;
  }
});

// Pre-save hook to update the updatedAt field
subjectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better query performance
// Removed the isFavorite index as it's not at the root level
subjectSchema.index({ user: 1 });
subjectSchema.index({ name: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
