import Subject from '../models/subjectModel.js';

export const getAllSubjects = async (user) => {
    try {
        const subjects = await Subject.find({ user }).sort({ createdAt: -1 });
        return subjects; // Send the subjects as a response if not found then [] empty array
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return [];
    }
}

export const createSubject = async (userId, subjectData) => {
    try {
        const subject = new Subject({
            ...subjectData,
            user: userId
        });
        await subject.save(); // Save the subject to the database
        console.log('Subject created:', subject);
        return subject; // Return the created subject
    } catch (error) {
        console.error('Error creating subject:', error);
        return { message: error.message };
    }
}

export const deleteSubject = async (userId, subjectId) => {
    try {
        const deleted = await Subject.deleteOne({
            _id: subjectId,
            user: userId
        }); // Delete the subject
        if (deleted.deletedCount === 0) {
            return { message: 'Subject not found or already deleted' };
        }
        return { message: 'Subject deleted successfully' };
    } catch (error) {
        console.error('Error deleting subject:', error);
        return { message: error.message };
    }
}

// All syllabus-related functions have been removed

// add lecture to a subject by id-> subjectId/lecture
// expect lectureData: { title: "Lecture 1", date: "2023-10-01", content: "Lecture content", attachments: [] } attachments should be an array of objects with id, name, type, size, url
export const addLecture = async (userId, subjectId, lectureData) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $push: { "courseMaterials.lectures": lectureData } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error adding lecture:', error);
        return { message: error.message };

    }
}

// edit lecture of a subject by id-> subjectId/lecture/lectureId
// expect lectureData: { title: "Lecture 1", date: "2023-10-01", content: "Lecture content", attachments: [] } attachments should be an array of objects with id, name, type, size, url
export const editLecture = async (userId, subjectId, lectureId, lectureData) => {
    try {
        // Ensure lectureData has _id field instead of id
        if (lectureData.id && !lectureData._id) {
            lectureData._id = lectureData.id;
            delete lectureData.id;
        }

        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId, "courseMaterials.lectures._id": lectureId },
            { $set: { "courseMaterials.lectures.$": lectureData } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or lecture not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error editing lecture:', error);
        return { message: error.message };
    }
}

// delete lecture of a subject by id-> subjectId/lecture/lectureId
export const deleteLecture = async (userId, subjectId, lectureId) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $pull: { "courseMaterials.lectures": { _id: lectureId } } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or lecture not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error deleting lecture:', error);
        return { message: error.message };
    }
}

// add reading to a subject by id-> subjectId/reading
// expect readingData: { title: "Reading 1", type: "TEXTBOOK", typeFieldOne: "Author", typeFieldTwo: "Publisher", attachments: [] } attachments should be an array of objects with id, name, type, size, url
export const addReading = async (userId, subjectId, readingData) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $push: { "courseMaterials.readings": readingData } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error adding reading:', error);
        return { message: error.message };
    }
}

// edit reading of a subject by id-> subjectId/reading/readingId
// expect readingData: { title: "Reading 1", type: "TEXTBOOK", typeFieldOne: "Author", typeFieldTwo: "Publisher", attachments: [] } attachments should be an array of objects with id, name, type, size, url
export const editReading = async (userId, subjectId, readingId, readingData) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId, "courseMaterials.readings._id": readingId },
            { $set: { "courseMaterials.readings.$": readingData } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or reading not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error editing reading:', error);
        return { message: error.message };
    }
}

// delete reading of a subject by id-> subjectId/reading/readingId
export const deleteReading = async (userId, subjectId, readingId) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $pull: { "courseMaterials.readings": { _id: readingId } } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or reading not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error deleting reading:', error);
        return { message: error.message };
    }
}

// add assignment to a subject by id-> subjectId/assignment
// expect assignmentData: { title: "Assignment 1", dueDate: "2023-10-01", points: 10, instructions: "Assignment instructions", isCompleted: false, isFavorite: false, attachments: [] }
export const addAssignment = async (userId, subjectId, assignmentData) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $push: { "courseMaterials.assignments": assignmentData } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error adding assignment:', error);
        return { message: error.message };
    }
}

// edit assignment of a subject by id-> subjectId/assignment/assignmentId
// expect assignmentData: { title: "Assignment 1", dueDate: "2023-10-01", points: 10, instructions: "Assignment instructions", isCompleted: false, isFavorite: false, attachments: [] }
export const editAssignment = async (userId, subjectId, assignmentId, assignmentData) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId, "courseMaterials.assignments._id": assignmentId },
            { $set: { "courseMaterials.assignments.$": assignmentData } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or assignment not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error editing assignment:', error);
        return { message: error.message };
    }
}

// delete assignment of a subject by id-> subjectId/assignment/assignmentId
export const deleteAssignment = async (userId, subjectId, assignmentId) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $pull: { "courseMaterials.assignments": { _id: assignmentId } } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or assignment not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error deleting assignment:', error);
        return { message: error.message };
    }
}

// add note to a subject by id-> subjectId/note
// expect noteData: { title: "Note 1", date: "2023-10-01", content: "Note content", tags: [] }
export const addNote = async (userId, subjectId, noteData) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $push: { "notes": noteData } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error adding note:', error);
        return { message: error.message };
    }
}

// edit note of a subject by id-> subjectId/note/noteId
// expect noteData: { title: "Note 1", date: "2023-10-01", content: "Note content", tags: [] }
export const editNote = async (userId, subjectId, noteId, noteData) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId, "notes._id": noteId },
            { $set: { "notes.$": noteData } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or note not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error editing note:', error);
        return { message: error.message };
    }
}

// delete note of a subject by id-> subjectId/note/noteId
export const deleteNote = async (userId, subjectId, noteId) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $pull: { "notes": { _id: noteId } } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or note not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error deleting note:', error);
        return { message: error.message };
    }
}

// Toggle favorite status of lecture
export const toggleLectureFavorite = async (userId, subjectId, lectureId) => {
    try {
        // First find the subject and lecture to get current favorite status
        const subject = await Subject.findOne(
            { _id: subjectId, user: userId, "courseMaterials.lectures._id": lectureId }
        );

        if (!subject) {
            return { message: 'Subject or lecture not found or not authorized' };
        }

        // Find the lecture in the array
        const lecture = subject.courseMaterials.lectures.find(
            lecture => lecture._id.toString() === lectureId
        );

        if (!lecture) {
            return { message: 'Lecture not found' };
        }

        // Toggle favorite status
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId, "courseMaterials.lectures._id": lectureId },
            { $set: { "courseMaterials.lectures.$.isFavorite": !lecture.isFavorite } },
            { new: true }
        );

        return updatedSubject;
    } catch (error) {
        console.error('Error toggling lecture favorite:', error);
        return { message: error.message };
    }
}

// Toggle favorite status of assignment
export const toggleAssignmentFavorite = async (userId, subjectId, assignmentId) => {
    try {
        // First find the subject and assignment to get current favorite status
        const subject = await Subject.findOne(
            { _id: subjectId, user: userId, "courseMaterials.assignments._id": assignmentId }
        );

        if (!subject) {
            return { message: 'Subject or assignment not found or not authorized' };
        }

        // Find the assignment in the array
        const assignment = subject.courseMaterials.assignments.find(
            assignment => assignment._id.toString() === assignmentId
        );

        if (!assignment) {
            return { message: 'Assignment not found' };
        }

        // Toggle favorite status
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId, "courseMaterials.assignments._id": assignmentId },
            { $set: { "courseMaterials.assignments.$.isFavorite": !assignment.isFavorite } },
            { new: true }
        );

        return updatedSubject;
    } catch (error) {
        console.error('Error toggling assignment favorite:', error);
        return { message: error.message };
    }
}

// Toggle favorite status of reading
export const toggleReadingFavorite = async (userId, subjectId, readingId) => {
    try {
        // First find the subject and reading to get current favorite status
        const subject = await Subject.findOne(
            { _id: subjectId, user: userId, "courseMaterials.readings._id": readingId }
        );

        if (!subject) {
            return { message: 'Subject or reading not found or not authorized' };
        }

        // Find the reading in the array
        const reading = subject.courseMaterials.readings.find(
            reading => reading._id.toString() === readingId
        );

        if (!reading) {
            return { message: 'Reading not found' };
        }

        // Toggle favorite status
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId, "courseMaterials.readings._id": readingId },
            { $set: { "courseMaterials.readings.$.isFavorite": !reading.isFavorite } },
            { new: true }
        );

        return updatedSubject;
    } catch (error) {
        console.error('Error toggling reading favorite:', error);
        return { message: error.message };
    }
}

// Toggle favorite status of note
export const toggleNoteFavorite = async (userId, subjectId, noteId) => {
    try {
        // First find the subject and note to get current favorite status
        const subject = await Subject.findOne(
            { _id: subjectId, user: userId, "notes._id": noteId }
        );

        if (!subject) {
            return { message: 'Subject or note not found or not authorized' };
        }

        // Find the note in the array
        const note = subject.notes.find(
            note => note._id.toString() === noteId
        );

        if (!note) {
            return { message: 'Note not found' };
        }

        // Toggle favorite status
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId, "notes._id": noteId },
            { $set: { "notes.$.isFavorite": !note.isFavorite } },
            { new: true }
        );

        return updatedSubject;
    } catch (error) {
        console.error('Error toggling note favorite:', error);
        return { message: error.message };
    }
}

