import Subject from '../models/subjectModel.js';

export const getAllSubjects = async (user) => {
    try {
        const subjects = await Subject.find( { user }).sort({ createdAt: -1 }); 
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

export const updateSyllabus = async (userId, subjectId, syllabusData) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { "courseMaterials.syllabus": syllabusData },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error updating syllabus:', error);
        return { message: error.message };
    }
}


/*
Add Unit chapter list will be empty and passed as an empty array in unitData
Example unitData: {
    title: "Unit 1",
    weeks: 4,
    chapterList: []
}
*/
export const addUnit = async (userId, subjectId, unitData) => {
    try {

        console.log('Adding unit data:', unitData);
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $push: { "courseMaterials.syllabus.units": unitData } },
            { new: true }
        );
        console.log('Updated subject after adding unit:', updatedSubject);
        if (!updatedSubject) {
            return { message: 'Subject not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error adding unit:', error);
        return { message: error.message };
    }
}


export const editUnit = async (userId, subjectId, unitId, unitData) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId, "courseMaterials.syllabus.units._id": unitId },
            { $set: { "courseMaterials.syllabus.units.$": unitData } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or unit not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error editing unit:', error);
        return { message: error.message };
        
    }
}

export const deleteUnit = async (userId, subjectId, unitId) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $pull: { "courseMaterials.syllabus.units": { _id: unitId } } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or unit not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error deleting unit:', error);
        return { message: error.message };
    }
}

// add chapter to a unit of a subject by id-> subjectId/unit/unitId
// expect chapterData: { title: "Chapter 1", subtopics: [] } subtopics should be an array of strings may be empty or contains subtopics
export const addChapter = async (userId, subjectId, unitId, chapterData) => {
    try {
        // Push the chapterData (which should follow the schema with _id, title, and subtopics) to the chapters array
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId, "courseMaterials.syllabus.units._id": unitId },
            { $push: { "courseMaterials.syllabus.units.$.chapters": chapterData } },
            { new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or unit not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error adding chapter:', error);
        return { message: error.message };
    }
}

// EDit chapter of a unit of a subject by id-> subjectId/unit/unitId/chapter/chapterId
export const editChapter = async (userId, subjectId, unitId, chapterId, chapterData) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $set: { "courseMaterials.syllabus.units.$[unit].chapters.$[chapter]": chapterData } },
            { new: true, arrayFilters: [{ "unit._id": unitId }, { "chapter._id": chapterId }] }
        );
        if (!updatedSubject) {
            return { message: 'Subject or unit or chapter not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error editing chapter:', error);
        return { message: error.message };
    }
}

// delete chapter of a unit of a subject by id-> subjectId/unit/unitId/chapter/chapterId
export const deleteChapter = async (userId, subjectId, unitId, chapterId) => {
    try {
        const updatedSubject = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $pull: { "courseMaterials.syllabus.units.$[unit].chapters": { _id: chapterId } } },
            { arrayFilters: [{ "unit._id": unitId }], new: true }
        );
        if (!updatedSubject) {
            return { message: 'Subject or unit or chapter not found or not authorized' };
        }
        return updatedSubject;
    } catch (error) {
        console.error('Error deleting chapter:', error);
        return { message: error.message };
    }
}


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

