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
            { arrayFilters: [{ "unit._id": unitId }] },
            { new: true }
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
