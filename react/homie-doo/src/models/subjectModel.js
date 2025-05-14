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
        this.lectures = Array.isArray(data.lectures) ? data.lectures.map(lecture => new LectureModel(lecture)) : [];
        this.readings = Array.isArray(data.readings) ? data.readings.map(reading => new ReadingModel(reading)) : [];
        this.assignments = Array.isArray(data.assignments) ? data.assignments.map(assignment => new AssignmentModel(assignment)) : [];
        this.syllabus = data.syllabus || { title: '', content: '', units: [], sections: [] };
    }
}

// Main Subject model
class SubjectModel {
    constructor(data = {}) {
        // Handle both id and _id to ensure consistency
        this._id = data._id || data.id || null;
        this.id = data._id?.toString() || data.id?.toString() || null;
        this.name = data.name || '';
        this.user = data.user || null;
        this.courseMaterials = new CourseMaterialsModel(data.courseMaterials || {});
        this.notes = Array.isArray(data.notes) ? data.notes.map(note => new NoteModel(note)) : [];
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
        this.icon = data.icon || '📚'; // Default icon
        this.color = data.color || '#FFFFFF'; // Default color
    }

    // Helper to create an empty subject with default values
    static createEmpty(userId) {
        return new SubjectModel({
            name: '',
            user: userId,
            icon: '📚',
            color: '#FFFFFF',
            courseMaterials: {
                lectures: [],
                readings: [],
                assignments: [],
                syllabus: {
                    title: '',
                    content: '',
                    units: [],
                    sections: []
                }
            },
            notes: []
        });
    }

    // Helper to convert backend data to frontend model
    static fromBackend(data) {
        if (!data) return null;

        // Make a deep copy to avoid modifying the original
        const processedData = JSON.parse(JSON.stringify(data));

        // Ensure subject ID consistency
        if (processedData._id && !processedData.id) {
            processedData.id = processedData._id.toString();
        } else if (processedData.id && !processedData._id) {
            processedData._id = processedData.id;
        }

        // Ensure critical fields exist
        if (!processedData.name || processedData.name === '') {
            console.warn('Missing name in subject data from backend');
        }

        if (!processedData.user) {
            console.warn('Missing user in subject data from backend');
        }

        // Handle missing courseMaterials
        if (!processedData.courseMaterials) {
            processedData.courseMaterials = {};
        }

        // Create the model with our processed data
        const subject = new SubjectModel(processedData);

        // Ensure we have proper date handling throughout the model
        if (subject.courseMaterials?.lectures) {
            subject.courseMaterials.lectures.forEach(lecture => {
                if (lecture.date && !(lecture.date instanceof Date)) {
                    lecture.date = new Date(lecture.date);
                }
                // Ensure lecture IDs are consistent
                if (lecture._id && !lecture.id) lecture.id = lecture._id.toString();
                if (lecture.id && !lecture._id) lecture._id = lecture.id;
            });
        }

        if (subject.courseMaterials?.assignments) {
            subject.courseMaterials.assignments.forEach(assignment => {
                if (assignment.dueDate && !(assignment.dueDate instanceof Date)) {
                    assignment.dueDate = new Date(assignment.dueDate);
                }
                // Ensure assignment IDs are consistent
                if (assignment._id && !assignment.id) assignment.id = assignment._id.toString();
                if (assignment.id && !assignment._id) assignment._id = assignment.id;
            });
        }

        if (subject.courseMaterials?.readings) {
            subject.courseMaterials.readings.forEach(reading => {
                // Ensure reading IDs are consistent
                if (reading._id && !reading.id) reading.id = reading._id.toString();
                if (reading.id && !reading._id) reading._id = reading.id;
            });
        }

        if (subject.notes) {
            subject.notes.forEach(note => {
                if (note.date && !(note.date instanceof Date)) {
                    note.date = new Date(note.date);
                }
                // Ensure note IDs are consistent
                if (note._id && !note.id) note.id = note._id.toString();
                if (note.id && !note._id) note._id = note.id;
            });
        }

        return subject;
    }

    // Helper to prepare data for backend submission
    toBackend() {
        // Create a copy of the object without methods
        const data = JSON.parse(JSON.stringify(this));

        // Remove id and _id from the top-level object so that the backend receives only the expected properties
        delete data.id;
        delete data._id;

        // Ensure lectures have proper _id
        if (data.courseMaterials?.lectures) {
            data.courseMaterials.lectures.forEach(lecture => {
                if (lecture.id && !lecture._id) {
                    lecture._id = lecture.id;
                }
            });
        }

        // Ensure readings have proper _id
        if (data.courseMaterials?.readings) {
            data.courseMaterials.readings.forEach(reading => {
                if (reading.id && !reading._id) {
                    reading._id = reading.id;
                }
            });
        }

        // Ensure assignments have proper _id
        if (data.courseMaterials?.assignments) {
            data.courseMaterials.assignments.forEach(assignment => {
                if (assignment.id && !assignment._id) {
                    assignment._id = assignment.id;
                }
            });
        }

        // Ensure notes have proper _id
        if (data.notes) {
            data.notes.forEach(note => {
                if (note.id && !note._id) {
                    note._id = note.id;
                }
            });
        }

        return data;
    }
}

export {
    SubjectModel,
    LectureModel,
    ReadingModel,
    AssignmentModel,
    NoteModel,
    AttachmentModel
};

export default SubjectModel;
