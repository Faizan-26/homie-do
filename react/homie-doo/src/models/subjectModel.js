/**
 * Frontend Subject Model
 * Represents the data structure used for subjects in the application
 */

// Attachment model for file uploads
class AttachmentModel {
    constructor(data = {}) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.type = data.type || '';
        this.size = data.size || 0;
        this.url = data.url || '';
    }
}

// Chapter model within Units
class ChapterModel {
    constructor(data = {}) {
        this.id = data.id || '';
        this.title = data.title || '';
        this.subtopics = Array.isArray(data.subtopics) ? data.subtopics.map(subtopic => {
            if (typeof subtopic === 'string') {
                return { id: '', title: subtopic };
            }
            return { id: subtopic.id || '', title: subtopic.title || '' };
        }) : [];
    }
}

// Unit model within Syllabus
class UnitModel {
    constructor(data = {}) {
        this.id = data.id || '';
        this.title = data.title || '';
        this.weeks = data.weeks || '';
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
        this.id = data.id || '';
        this.title = data.title || '';
        this.date = data.date || '';
        this.content = data.content || '';
        this.attachments = Array.isArray(data.attachments) ? data.attachments.map(attachment => new AttachmentModel(attachment)) : [];
    }
}

// Reading model
class ReadingModel {
    constructor(data = {}) {
        this.id = data.id || '';
        this.title = data.title || '';
        this.type = data.type || ''; // TEXTBOOK, ARTICLE, VIDEO, etc.
        this.typeFieldOne = data.typeFieldOne || '';
        this.typeFieldTwo = data.typeFieldTwo || '';
        this.attachments = Array.isArray(data.attachments) ? data.attachments.map(attachment => new AttachmentModel(attachment)) : [];
    }
}

// Assignment model
class AssignmentModel {
    constructor(data = {}) {
        this.id = data.id || '';
        this.title = data.title || '';
        this.dueDate = data.dueDate || '';
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
        this.id = data.id || '';
        this.title = data.title || '';
        this.date = data.date || '';
        this.content = data.content || '';
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
    }

    // Helper to create an empty subject with default values
    static createEmpty(userId) {
        return new SubjectModel({
            name: '',
            user: userId,
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
    }

    // Helper to convert backend data to frontend model
    static fromBackend(data) {
        return new SubjectModel(data);
    }

    // Helper to prepare data for backend submission
    toBackend() {
        // Create a copy of the object without methods
        const data = JSON.parse(JSON.stringify(this));
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
