/**
 * Frontend Subject Model
 * Represents the data structure used for subjects in the application
 */

// Attachment model for file uploads
class AttachmentModel {
    constructor(data = {}) {
        this._id = data._id || null;
        this.id = data.id || (data._id ? data._id.toString() : '');
        this.name = data.name || '';
        this.type = data.type || '';
        this.size = data.size || 0;
        this.url = data.url || '';
    }
}

// Chapter model within Units
class ChapterModel {
    constructor(data = {}) {
        this._id = data._id || null;
        this.id = data.id || (data._id ? data._id.toString() : '');
        this.title = data.title || '';
        // Backend stores subtopics as simple strings
        this.subtopics = Array.isArray(data.subtopics) 
            ? data.subtopics.map(subtopic => {
                if (typeof subtopic === 'string') {
                    return subtopic;
                }
                return subtopic.title || ''; // Extract just the title from object format
            }) 
            : [];
    }
}

// Unit model within Syllabus
class UnitModel {
    constructor(data = {}) {
        this._id = data._id || null;
        this.id = data.id || (data._id ? data._id.toString() : '');
        this.title = data.title || '';
        // Changed from string to number to match backend
        this.weeks = typeof data.weeks === 'number' ? data.weeks : (parseInt(data.weeks) || 0);
        this.chapters = Array.isArray(data.chapters) ? data.chapters.map(chapter => new ChapterModel(chapter)) : [];
    }

    // Helper method to add a chapter
    addChapter(chapter) {
        this.chapters.push(new ChapterModel(chapter));
    }
}

// Syllabus model
class SyllabusModel {
    constructor(data = {}) {
        this.title = data.title || '';
        this.content = data.content || '';
        this.units = Array.isArray(data.units) ? data.units.map(unit => new UnitModel(unit)) : [];
    }

    // Helper method to add a unit
    addUnit(unit) {
        this.units.push(new UnitModel(unit));
    }
}

// Lecture model
class LectureModel {
    constructor(data = {}) {
        this._id = data._id || null;
        this.id = data.id || (data._id ? data._id.toString() : '');
        this.title = data.title || '';
        // Handle date as proper Date object to match backend
        this.date = data.date ? new Date(data.date) : new Date();
        this.isFavorite = data.isFavorite || false;
        this.content = data.content || '';
        this.attachments = Array.isArray(data.attachments) ? data.attachments.map(attachment => new AttachmentModel(attachment)) : [];
    }
}

// Reading model
class ReadingModel {
    constructor(data = {}) {
        this._id = data._id || null;
        this.id = data.id || (data._id ? data._id.toString() : '');
        this.title = data.title || '';
        this.type = data.type || ''; // TEXTBOOK, ARTICLE, VIDEO, etc.
        this.typeFieldOne = data.typeFieldOne || '';
        this.isFavorite = data.isFavorite || false;
        this.typeFieldTwo = data.typeFieldTwo || '';
        this.attachments = Array.isArray(data.attachments) ? data.attachments.map(attachment => new AttachmentModel(attachment)) : [];
    }
}

// Assignment model
class AssignmentModel {
    constructor(data = {}) {
        this._id = data._id || null;
        this.id = data.id || (data._id ? data._id.toString() : '');
        this.title = data.title || '';
        // Handle dueDate as proper Date object to match backend
        this.dueDate = data.dueDate ? new Date(data.dueDate) : null;
        this.points = data.points || 0;
        this.instructions = data.instructions || '';
        this.isCompleted = data.isCompleted || false;
        this.isFavorite = data.isFavorite || false;
        this.attachments = Array.isArray(data.attachments) ? data.attachments.map(attachment => new AttachmentModel(attachment)) : [];
    }
}

// Note model
class NoteModel {
    constructor(data = {}) {
        this._id = data._id || null;
        this.id = data.id || (data._id ? data._id.toString() : '');
        this.title = data.title || '';
        // Handle date as proper Date object to match backend
        this.date = data.date ? new Date(data.date) : new Date();
        this.content = data.content || '';
        this.isFavorite = data.isFavorite || false;
        this.tags = data.tags || [];
    }
}

// Course Materials model
class CourseMaterialsModel {
    constructor(data = {}) {
        this.syllabus = new SyllabusModel(data.syllabus || {});
        this.lectures = Array.isArray(data.lectures) ? data.lectures.map(lecture => new LectureModel(lecture)) : [];
        this.readings = Array.isArray(data.readings) ? data.readings.map(reading => new ReadingModel(reading)) : [];
        this.assignments = Array.isArray(data.assignments) ? data.assignments.map(assignment => new AssignmentModel(assignment)) : [];
    }
}

// Main Subject model
class SubjectModel {
    constructor(data = {}) {
        // Use MongoDB's _id for the main subject ID
        this._id = data._id || null;
        // All other entities use id field consistently
        this.name = data.name || '';
        this.user = data.user || null;
        this.courseMaterials = new CourseMaterialsModel(data.courseMaterials || {});
        this.notes = Array.isArray(data.notes) ? data.notes.map(note => new NoteModel(note)) : [];
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
        this.icon = data.icon || '📚'; // Default icon
        this.color = data.color || '#FFFFFF'; // Default color
    }

    // get id method to return the subject ID
    get id() {
        return this._id ? this._id.toString() : null;
    }

    

    // Helper to create an empty subject with default values
    static createEmpty(userId) {
        return new SubjectModel({
            name: '',
            user: userId,
            icon: '📚',
            color: '#FFFFFF',
            courseMaterials: {
                syllabus: {
                    title: '',
                    content: '',
                    units: []
                },
                lectures: [],
                readings: [],
                assignments: []
            },
            notes: []
        });
    }    // Helper to convert backend data to frontend model
    static fromBackend(data) {
        const subject = new SubjectModel(data);
        
        // Ensure we have proper date handling throughout the model
        if (subject.courseMaterials?.lectures) {
            subject.courseMaterials.lectures.forEach(lecture => {
                if (lecture.date && !(lecture.date instanceof Date)) {
                    lecture.date = new Date(lecture.date);
                }
            });
        }
        
        if (subject.courseMaterials?.assignments) {
            subject.courseMaterials.assignments.forEach(assignment => {
                if (assignment.dueDate && !(assignment.dueDate instanceof Date)) {
                    assignment.dueDate = new Date(assignment.dueDate);
                }
            });
        }
        
        if (subject.notes) {
            subject.notes.forEach(note => {
                if (note.date && !(note.date instanceof Date)) {
                    note.date = new Date(note.date);
                }
            });
        }
        
        return subject;
    }    // Helper to prepare data for backend submission
    toBackend() {
        // Create a copy of the object without methods
        const data = JSON.parse(JSON.stringify(this));
        
        // Clean up any frontend-specific properties that shouldn't go to the backend
        // We'll keep the MongoDB _id if it exists, but remove the frontend id
        if (data._id) {
            delete data.id;
        }
        
        // Ensure subtopics are stored as simple strings (not objects) in each chapter
        if (data.courseMaterials?.syllabus?.units) {
            data.courseMaterials.syllabus.units.forEach(unit => {
                if (unit.chapters) {
                    unit.chapters.forEach(chapter => {
                        // Convert any object-based subtopics to simple strings
                        if (chapter.subtopics) {
                            chapter.subtopics = chapter.subtopics.map(subtopic => 
                                typeof subtopic === 'object' ? subtopic.title || subtopic.toString() : subtopic
                            );
                        }
                    });
                }
                // Ensure weeks is stored as a number
                if (unit.weeks && typeof unit.weeks === 'string') {
                    unit.weeks = parseInt(unit.weeks) || 0;
                }
            });
        }
        
        return data;
    }
}

export {
    SubjectModel,
    UnitModel,
    ChapterModel,
    LectureModel,
    ReadingModel,
    AssignmentModel,
    NoteModel,
    AttachmentModel
};

export default SubjectModel;
