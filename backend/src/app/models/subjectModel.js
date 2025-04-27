import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

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
        id: { type: String, required: true, default: () => uuidv4() },
        title: { type: String, required: true },
        weeks: { type: String },
        chapters: [{
          id: { type: String, required: true, default: () => uuidv4() },
          title: { type: String, required: true },
          subtopics: [{
            id: { type: String, required: true, default: () => uuidv4() },
            title: { type: String, required: true }
          }]
        }]
      }]
    },
    lectures: [{
      id: { type: String, required: true, default: () => uuidv4() },
      title: { type: String },
      date: { type: String },
      content: { type: String },
      attachments: [{
        id: { type: String, required: true, default: () => uuidv4() },
        name: { type: String }, // name of the file
        type: { type: String }, // pdf, doc, etc.
        size: { type: Number }, // size in bytes
        url: { type: String }, // CLOUDINARY URL
      }] // list of files
    }],
    readings: [{
      id: { type: String, required: true, default: () => uuidv4() },
      title: { type: String },
      type: { type: String }, // TEXTBOOK, ARTICLE, VIDEO, etc.
      typeFieldOne: { type: String },
      typeFieldTwo: { type: String },
      attachments: [{
        id: { type: String, required: true, default: () => uuidv4() },
        name: { type: String }, // name of the file
        type: { type: String }, // pdf, doc, etc.
        size: { type: Number }, // size in bytes
        url: { type: String }, // CLOUDINARY URL
      }] // list of files
    }],
    assignments: [{
      id: { type: String, required: true, default: () => uuidv4() },
      title: { type: String },
      dueDate: { type: String },
      points: { type: Number },
      instructions: { type: String },
      isCompleted: { type: Boolean, default: false },
      isFavorite: { type: Boolean, default: false },
      attachments: [{
        id: { type: String, required: true, default: () => uuidv4() },
        name: { type: String }, // name of the file
        type: { type: String }, // pdf, doc, etc.
        size: { type: Number }, // size in bytes
        url: { type: String }, // CLOUDINARY URL
      }] // list of files
    }]
  },
  notes: [{
    id: { type: String, required: true, default: () => uuidv4() },
    title: { type: String },
    date: { type: String },
    content: { type: String },
    tags: [{ type: String }],
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

// Pre-save hook to ensure all embedded documents have IDs
subjectSchema.pre('save', function (next) {
  // Update the updatedAt field
  this.updatedAt = Date.now();

  // Assign IDs to syllabus units if they don't have one
  if (this.courseMaterials?.syllabus?.units) {
    this.courseMaterials.syllabus.units.forEach(unit => {
      // Preserve existing ID or generate a new one
      unit.id = unit.id || uuidv4();

      // Assign IDs to chapters
      if (unit.chapters) {
        unit.chapters.forEach(chapter => {
          // Preserve existing ID or generate a new one
          chapter.id = chapter.id || uuidv4();

          // Handle subtopics
          if (chapter.subtopics) {
            chapter.subtopics = chapter.subtopics.map(subtopic => {
              if (typeof subtopic === 'string') {
                return { id: uuidv4(), title: subtopic };
              }
              // Preserve existing ID or generate a new one
              subtopic.id = subtopic.id || uuidv4();
              return subtopic;
            });
          }
        });
      }
    });
  }

  // Assign IDs to lectures
  if (this.courseMaterials?.lectures) {
    this.courseMaterials.lectures.forEach(lecture => {
      // Preserve existing ID or generate a new one
      lecture.id = lecture.id || uuidv4();

      // Assign IDs to attachments
      if (lecture.attachments) {
        lecture.attachments.forEach(attachment => {
          // Preserve existing ID or generate a new one
          attachment.id = attachment.id || uuidv4();
        });
      }
    });
  }

  // Assign IDs to readings
  if (this.courseMaterials?.readings) {
    this.courseMaterials.readings.forEach(reading => {
      // Preserve existing ID or generate a new one
      reading.id = reading.id || uuidv4();

      // Assign IDs to attachments
      if (reading.attachments) {
        reading.attachments.forEach(attachment => {
          // Preserve existing ID or generate a new one
          attachment.id = attachment.id || uuidv4();
        });
      }
    });
  }

  // Assign IDs to assignments
  if (this.courseMaterials?.assignments) {
    this.courseMaterials.assignments.forEach(assignment => {
      // Preserve existing ID or generate a new one
      assignment.id = assignment.id || uuidv4();

      // Assign IDs to attachments
      if (assignment.attachments) {
        assignment.attachments.forEach(attachment => {
          // Preserve existing ID or generate a new one
          attachment.id = attachment.id || uuidv4();
        });
      }
    });
  }

  // Assign IDs to notes
  if (this.notes) {
    this.notes.forEach(note => {
      // Preserve existing ID or generate a new one
      note.id = note.id || uuidv4();
    });
  }

  next();
});

// Transform method to ensure all IDs are returned properly in JSON
subjectSchema.set('toJSON', {
  transform: function (doc, ret) {
    // Keep the document _id as is for the main subject ID
    return ret;
  }
});

// Create indexes for better query performance
subjectSchema.index({ user: 1 });
subjectSchema.index({ name: 1 });
subjectSchema.index({ isFavorite: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;

