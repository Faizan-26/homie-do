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
      id: { type: String, required: true, },
      title: { type: String, required: true },
      weeks: { type: String },
      chapters: [{
        id: { type: String, required: true, },
        title: { type: String, required: true },
        subtopics: [String],// contains an array of subtopics as strings like //"Chapter 1.1", "Chapter 1.2", etc.
      }]
    }]
  },
  lectures: [{
    id: { type: String, required: true, },
    title: { type: String },
    date: { type: String },
    content: { type: String },
    attachments: [{
      id: { type: String, required: true, },
      name: { type: String }, // name of the file
      type: { type: String }, // pdf, doc, etc.
      size: { type: Number }, // size in bytes
      url: { type: String }, // CLOUDINARY URL
    }] // list of files
  }],
  readings: [{
    id: { type: String, required: true, },
    title: { type: String },
    type: { type: String }, // TEXTBOOK, ARTICLE, VIDEO, etc.
    typeFieldOne: { type: String },
    typeFieldTwo: { type: String },
    attachments: [{
      id: { type: String, required: true, },
      name: { type: String }, // name of the file
      type: { type: String }, // pdf, doc, etc.
      size: { type: Number }, // size in bytes
      url: { type: String }, // CLOUDINARY URL
    }] // list of files
  }],
  assignments: [{
    id: { type: String, required: true, },
    title: { type: String },
    dueDate: { type: String },
    points: { type: Number },
    instructions: { type: String },
    isCompleted: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    attachments: [{
      id: { type: String, required: true, },
      name: { type: String }, // name of the file
      type: { type: String }, // pdf, doc, etc.
      size: { type: Number }, // size in bytes
      url: { type: String }, // CLOUDINARY URL
    }] // list of files
  }]
},
notes: [{
  id: { type: String, required: true, },
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
subjectSchema.set('toJSON', {
virtuals: true,           // expose virtuals (like “id”)
transform: (doc, ret) => {
  ret.id = ret._id.toString();  // copy `_id` → `id`
  delete ret._id;               // (optional) drop the ObjectID
  delete ret.__v;               // (optional) drop the version key
  return ret;
}
});

// Pre-save hook to ensure all embedded documents have IDs
subjectSchema.pre('save', function (next) {
// Update the updatedAt field
this.updatedAt = Date.now();
next();
});

// Transform method to ensure all IDs are returned properly in JSON
subjectSchema.set('toJSON', {
transform: function (doc, ret) {
  return ret;
}
});

// Create indexes for better query performance
subjectSchema.index({ user: 1 });
subjectSchema.index({ name: 1 });
subjectSchema.index({ isFavorite: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;

//=========================================================
// import mongoose from 'mongoose';

// // Subdocument schemas
// const SubtopicSchema = new mongoose.Schema({
//   id: { type: String, required: true },
//   title: { type: String, required: true }
// }, { _id: false });

// const ChapterSchema = new mongoose.Schema({
//   id: { type: String, required: true },
//   title: { type: String, required: true },
//   subtopics: [SubtopicSchema]
// }, { _id: false });

// const UnitSchema = new mongoose.Schema({
//   id: { type: String, required: true },
//   title: { type: String, required: true },
//   weeks: { type: String },
//   chapters: [ChapterSchema]
// }, { _id: false });

// const AttachmentSchema = new mongoose.Schema({
//   id: { type: String, required: true },
//   name: String,
//   type: String,
//   size: Number,
//   url: String
// }, { _id: false });

// // Main Subject schema
// const SubjectSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   courseMaterials: {
//     syllabus: { title: String, content: String, units: [UnitSchema] },
//     lectures: [{ id: String, title: String, date: Date, content: String, attachments: [AttachmentSchema] }],
//     readings: [{ id: String, title: String, type: String, attachments: [AttachmentSchema] }],
//     assignments: [{ id: String, title: String, dueDate: Date, points: Number, instructions: String, isCompleted: Boolean, isFavorite: Boolean, attachments: [AttachmentSchema] }]
//   },
//   notes: [{ id: String, title: String, date: Date, content: String, tags: [String] }]
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Virtual id
// SubjectSchema.set('toJSON', {
//   virtuals: true,
//   transform: (_doc, ret) => {
//     ret.id = ret._id.toString();
//     delete ret._id;
//     delete ret.__v;
//     return ret;
//   }
// });

// // Indexes
// SubjectSchema.index({ user: 1, name: 1 }, { unique: true });

// export default mongoose.model('Subject', SubjectSchema);
