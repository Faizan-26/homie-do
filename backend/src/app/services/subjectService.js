import Subject from '../models/subjectModel.js';
import { v4 as uuidv4 } from 'uuid';

// Subject CRUD operations
export const createSubject = async (subjectData) => {
    try {
        const subject = new Subject(subjectData);
        await subject.save();
        console.log("Subject PIK", subject);
        return subject.toJSON();// now subject.toJSON() has an `.id`
    } catch (error) {
        throw new Error(`Error creating subject: ${error.message}`);
    }
};


export const getSubjectById = async (subjectId, userId) => {
    try {
        return await Subject.findOne({ _id: subjectId, user: userId });
    } catch (error) {
        throw new Error(`Error getting subject: ${error.message}`);
    }
};

export const updateSubject = async (subjectId, userId, updateData) => {
    try {
        return await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            updateData,
            { new: true }
        );
    } catch (error) {
        throw new Error(`Error updating subject: ${error.message}`);
    }
};

export const deleteSubject = async (subjectId, userId) => {
    try {
        return await Subject.findOneAndDelete({ _id: subjectId, user: userId });
    } catch (error) {
        throw new Error(`Error deleting subject: ${error.message}`);
    }
};

// Unit CRUD operations
export const addUnit = async (subjectId, userId, unitData) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');
        console.log("Unit Data PIK", unitData);
        unitData.id = uuidv4();
        console.log("Unit Data PIK", unitData);
        subject.courseMaterials.syllabus.units.push(unitData);
        await subject.save();
        return unitData;
    } catch (error) {
        throw new Error(`Error adding unit: ${error.message}`);
    }
};

export const getUnits = async (subjectId, userId) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        return subject.courseMaterials.syllabus.units;
    } catch (error) {
        throw new Error(`Error getting units: ${error.message}`);
    }
};

export const updateUnit = async (subjectId, userId, unitId, updateData) => {
    const updated = await Subject.findOneAndUpdate(
        { _id: subjectId, user: userId },
        {
            $set: {
                'courseMaterials.syllabus.units.$[unit].title': updateData.title,
                'courseMaterials.syllabus.units.$[unit].weeks': updateData.weeks,
            }
        },
        {
            new: true,
            runValidators: true,
            arrayFilters: [{ 'unit._id': unitId }]
        }
    );

    if (!updated) throw new Error('Subject or Unit not found');
    return updated;
};


export const deleteUnit = async (subjectId, userId, unitId) => {
    try {
        const updated = await Subject.findOneAndUpdate(
            { _id: subjectId, user: userId },
            { $pull: { 'courseMaterials.syllabus.units': { _id: unitId } } },
            { new: true }
        );
        if (!updated) throw new Error('Subject not found or unit didn’t exist');
        return { success: true };
    } catch (error) {
        throw new Error(`Error deleting unit: ${error.message}`);
    }
};


// Chapter CRUD operations
export const addChapter = async (subjectId, userId, unitId, chapterData) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        const unit = subject.courseMaterials.syllabus.units.find(
            unit => unit.id === unitId
        );

        if (!unit) throw new Error('Unit not found');
        chapterData.id = uuidv4();
        unit.chapters.push(chapterData);
        await subject.save();

        return unit.chapters[unit.chapters.length - 1];
    } catch (error) {
        throw new Error(`Error adding chapter: ${error.message}`);
    }
};

export const getChapters = async (subjectId, userId, unitId) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        const unit = subject.courseMaterials.syllabus.units.find(
            unit => unit.id === unitId
        );

        if (!unit) throw new Error('Unit not found');

        return unit.chapters;
    } catch (error) {
        throw new Error(`Error getting chapters: ${error.message}`);
    }
};

export const updateChapter = async (subjectId, userId, unitId, chapterId, updateData) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        const unit = subject.courseMaterials.syllabus.units.find(
            unit => unit.id === unitId
        );

        if (!unit) throw new Error('Unit not found');

        const chapterIndex = unit.chapters.findIndex(
            chapter => chapter.id === chapterId
        );

        if (chapterIndex === -1) throw new Error('Chapter not found');

        // Preserve the ID
        const originalChapterId = unit.chapters[chapterIndex].id;
        Object.assign(unit.chapters[chapterIndex], updateData);
        unit.chapters[chapterIndex].id = originalChapterId;

        await subject.save();

        return unit.chapters[chapterIndex];
    } catch (error) {
        throw new Error(`Error updating chapter: ${error.message}`);
    }
};

export const deleteChapter = async (subjectId, userId, unitId, chapterId) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        const unit = subject.courseMaterials.syllabus.units.find(
            unit => unit.id === unitId
        );

        if (!unit) throw new Error('Unit not found');

        unit.chapters = unit.chapters.filter(
            chapter => chapter.id !== chapterId
        );

        await subject.save();
        return { success: true };
    } catch (error) {
        throw new Error(`Error deleting chapter: ${error.message}`);
    }
};

// Lecture CRUD operations
export const addLecture = async (subjectId, userId, lectureData) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');
        lectureData.id = uuidv4();
        subject.courseMaterials.lectures.push(lectureData);
        await subject.save();

        return subject.courseMaterials.lectures[subject.courseMaterials.lectures.length - 1];
    } catch (error) {
        throw new Error(`Error adding lecture: ${error.message}`);
    }
};

export const getLectures = async (subjectId, userId) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        return subject.courseMaterials.lectures;
    } catch (error) {
        throw new Error(`Error getting lectures: ${error.message}`);
    }
};

export const updateLecture = async (subjectId, userId, lectureId, updateData) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        const lectureIndex = subject.courseMaterials.lectures.findIndex(
            lecture => lecture.id === lectureId
        );

        if (lectureIndex === -1) throw new Error('Lecture not found');

        // Preserve the ID
        const id = subject.courseMaterials.lectures[lectureIndex].id;
        Object.assign(subject.courseMaterials.lectures[lectureIndex], updateData);
        subject.courseMaterials.lectures[lectureIndex].id = id;

        await subject.save();

        return subject.courseMaterials.lectures[lectureIndex];
    } catch (error) {
        throw new Error(`Error updating lecture: ${error.message}`);
    }
};

export const deleteLecture = async (subjectId, userId, lectureId) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        subject.courseMaterials.lectures = subject.courseMaterials.lectures.filter(
            lecture => lecture.id !== lectureId
        );

        await subject.save();
        return { success: true };
    } catch (error) {
        throw new Error(`Error deleting lecture: ${error.message}`);
    }
};

// Reading CRUD operations
export const addReading = async (subjectId, userId, readingData) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');
        readingData.id = uuidv4();
        subject.courseMaterials.readings.push(readingData);
        await subject.save();

        return subject.courseMaterials.readings[subject.courseMaterials.readings.length - 1];
    } catch (error) {
        throw new Error(`Error adding reading: ${error.message}`);
    }
};

export const getReadings = async (subjectId, userId) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        return subject.courseMaterials.readings;
    } catch (error) {
        throw new Error(`Error getting readings: ${error.message}`);
    }
};

export const updateReading = async (subjectId, userId, readingId, updateData) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        const readingIndex = subject.courseMaterials.readings.findIndex(
            reading => reading.id === readingId
        );

        if (readingIndex === -1) throw new Error('Reading not found');

        // Preserve the ID
        const id = subject.courseMaterials.readings[readingIndex].id;
        Object.assign(subject.courseMaterials.readings[readingIndex], updateData);
        subject.courseMaterials.readings[readingIndex].id = id;

        await subject.save();

        return subject.courseMaterials.readings[readingIndex];
    } catch (error) {
        throw new Error(`Error updating reading: ${error.message}`);
    }
};

export const deleteReading = async (subjectId, userId, readingId) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        subject.courseMaterials.readings = subject.courseMaterials.readings.filter(
            reading => reading.id !== readingId
        );

        await subject.save();
        return { success: true };
    } catch (error) {
        throw new Error(`Error deleting reading: ${error.message}`);
    }
};

// Assignment CRUD operations
export const addAssignment = async (subjectId, userId, assignmentData) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');
        assignmentData.id = uuidv4();
        subject.courseMaterials.assignments.push(assignmentData);
        await subject.save();

        return subject.courseMaterials.assignments[subject.courseMaterials.assignments.length - 1];
    } catch (error) {
        throw new Error(`Error adding assignment: ${error.message}`);
    }
};

export const getAssignments = async (subjectId, userId) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        return subject.courseMaterials.assignments;
    } catch (error) {
        throw new Error(`Error getting assignments: ${error.message}`);
    }
};

export const updateAssignment = async (subjectId, userId, assignmentId, updateData) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        const assignmentIndex = subject.courseMaterials.assignments.findIndex(
            assignment => assignment.id === assignmentId
        );

        if (assignmentIndex === -1) throw new Error('Assignment not found');

        // Preserve the ID
        const id = subject.courseMaterials.assignments[assignmentIndex].id;
        Object.assign(subject.courseMaterials.assignments[assignmentIndex], updateData);
        subject.courseMaterials.assignments[assignmentIndex].id = id;

        await subject.save();

        return subject.courseMaterials.assignments[assignmentIndex];
    } catch (error) {
        throw new Error(`Error updating assignment: ${error.message}`);
    }
};

export const deleteAssignment = async (subjectId, userId, assignmentId) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        subject.courseMaterials.assignments = subject.courseMaterials.assignments.filter(
            assignment => assignment.id !== assignmentId
        );

        await subject.save();
        return { success: true };
    } catch (error) {
        throw new Error(`Error deleting assignment: ${error.message}`);
    }
};

export const getAllSubjects = async (userId) => {
    try {
        return await Subject.find({ user: userId });
    } catch (error) {
        throw new Error(`Error getting subjects: ${error.message}`);
    }
};


// ===========================================================

// // services/subjectService.js
// import Subject from '../models/subjectModel.js';
// import { v4 as uuidv4 } from 'uuid';

// /**
//  * Helper to load a subject or throw an error if not found
//  */
// async function loadSubject(subjectId, userId) {
//     const subject = await Subject.findOne({ _id: subjectId, user: userId });
//     if (!subject) throw new Error('Subject not found');
//     return subject;
// }

// // ==== SUBJECT CRUD ==== //

// /** Create a new subject */
// export const createSubject = async ({ name, user, courseMaterials, notes }) => {
//     const subject = new Subject({ name, user, courseMaterials, notes });
//     await subject.save();
//     return subject.toJSON();
// };

// /** Get all subjects for a user */
// export const getAllSubjects = async (userId) => {
//     return await Subject.find({ user: userId }).sort({ createdAt: -1 });
// };

// /** Get a single subject by ID */
// export const getSubjectById = async (subjectId, userId) => {
//     return await loadSubject(subjectId, userId);
// };

// /** Update a subject */
// export const updateSubject = async (subjectId, userId, updateData) => {
//     const subject = await Subject.findOneAndUpdate(
//         { _id: subjectId, user: userId },
//         { $set: updateData },
//         { new: true, runValidators: true }
//     );
//     if (!subject) throw new Error('Subject not found');
//     return subject;
// };

// /** Delete a subject */
// export const deleteSubject = async (subjectId, userId) => {
//     const result = await Subject.findOneAndDelete({ _id: subjectId, user: userId });
//     if (!result) throw new Error('Subject not found');
//     return { success: true };
// };

// // ==== UNIT CRUD ==== //

// /** Add a new unit to a subject */
// export const addUnit = async (subjectId, userId, unitData) => {
//     const subject = await loadSubject(subjectId, userId);
//     const unit = { id: uuidv4(), ...unitData, chapters: [] };
//     subject.courseMaterials.syllabus.units.push(unit);
//     await subject.save();
//     return unit;
// };

// /** Get all units of a subject */
// export const getUnits = async (subjectId, userId) => {
//     const subject = await loadSubject(subjectId, userId);
//     return subject.courseMaterials.syllabus.units;
// };

// /** Update a unit within a subject */
// export const updateUnit = async (subjectId, userId, unitId, data) => {
//     const subject = await loadSubject(subjectId, userId);
//     const unit = subject.courseMaterials.syllabus.units.find(u => u.id === unitId);
//     if (!unit) throw new Error('Unit not found');
//     Object.assign(unit, data);
//     await subject.save();
//     return unit;
// };

// /** Delete a unit from a subject */
// export const deleteUnit = async (subjectId, userId, unitId) => {
//     const subject = await loadSubject(subjectId, userId);
//     subject.courseMaterials.syllabus.units =
//         subject.courseMaterials.syllabus.units.filter(u => u.id !== unitId);
//     await subject.save();
//     return { success: true };
// };

// // ==== CHAPTER CRUD ==== //

// /** Add a chapter to a unit */
// export const addChapter = async (subjectId, userId, unitId, chapterData) => {
//     const subject = await loadSubject(subjectId, userId);
//     const unit = subject.courseMaterials.syllabus.units.find(u => u.id === unitId);
//     if (!unit) throw new Error('Unit not found');
//     const chapter = { id: uuidv4(), ...chapterData, subtopics: [] };
//     unit.chapters.push(chapter);
//     await subject.save();
//     return chapter;
// };

// /** Get all chapters of a unit */
// export const getChapters = async (subjectId, userId, unitId) => {
//     const subject = await loadSubject(subjectId, userId);
//     const unit = subject.courseMaterials.syllabus.units.find(u => u.id === unitId);
//     if (!unit) throw new Error('Unit not found');
//     return unit.chapters;
// };

// /** Update a chapter within a unit */
// export const updateChapter = async (subjectId, userId, unitId, chapterId, data) => {
//     const subject = await loadSubject(subjectId, userId);
//     const unit = subject.courseMaterials.syllabus.units.find(u => u.id === unitId);
//     if (!unit) throw new Error('Unit not found');
//     const chapter = unit.chapters.find(c => c.id === chapterId);
//     if (!chapter) throw new Error('Chapter not found');
//     Object.assign(chapter, data);
//     await subject.save();
//     return chapter;
// };

// /** Delete a chapter from a unit */
// export const deleteChapter = async (subjectId, userId, unitId, chapterId) => {
//     const subject = await loadSubject(subjectId, userId);
//     const unit = subject.courseMaterials.syllabus.units.find(u => u.id === unitId);
//     if (!unit) throw new Error('Unit not found');
//     unit.chapters = unit.chapters.filter(c => c.id !== chapterId);
//     await subject.save();
//     return { success: true };
// };

// // ==== SUBTOPIC CRUD ==== //

// /** Add a subtopic to a chapter */
// export const addSubtopic = async (subjectId, userId, unitId, chapterId, subtopicData) => {
//     const subject = await loadSubject(subjectId, userId);
//     const unit = subject.courseMaterials.syllabus.units.find(u => u.id === unitId);
//     if (!unit) throw new Error('Unit not found');
//     const chapter = unit.chapters.find(c => c.id === chapterId);
//     if (!chapter) throw new Error('Chapter not found');
//     const subtopic = { id: uuidv4(), ...subtopicData };
//     chapter.subtopics.push(subtopic);
//     await subject.save();
//     return subtopic;
// };

// /** Get all subtopics of a chapter */
// export const getSubtopics = async (subjectId, userId, unitId, chapterId) => {
//     const chapters = await getChapters(subjectId, userId, unitId);
//     const chapter = chapters.find(c => c.id === chapterId);
//     if (!chapter) throw new Error('Chapter not found');
//     return chapter.subtopics;
// };

// /** Update a subtopic within a chapter */
// export const updateSubtopic = async (subjectId, userId, unitId, chapterId, subtopicId, data) => {
//     const subject = await loadSubject(subjectId, userId);
//     const unit = subject.courseMaterials.syllabus.units.find(u => u.id === unitId);
//     if (!unit) throw new Error('Unit not found');
//     const chapter = unit.chapters.find(c => c.id === chapterId);
//     if (!chapter) throw new Error('Chapter not found');
//     const subtopic = chapter.subtopics.find(s => s.id === subtopicId);
//     if (!subtopic) throw new Error('Subtopic not found');
//     Object.assign(subtopic, data);
//     await subject.save();
//     return subtopic;
// };

// /** Delete a subtopic from a chapter */
// export const deleteSubtopic = async (subjectId, userId, unitId, chapterId, subtopicId) => {
//     const subject = await loadSubject(subjectId, userId);
//     const unit = subject.courseMaterials.syllabus.units.find(u => u.id === unitId);
//     if (!unit) throw new Error('Unit not found');
//     const chapter = unit.chapters.find(c => c.id === chapterId);
//     if (!chapter) throw new Error('Chapter not found');
//     chapter.subtopics = chapter.subtopics.filter(s => s.id !== subtopicId);
//     await subject.save();
//     return { success: true };
// };

// // ==== LECTURE CRUD ==== //

// /** Add a lecture to course materials */
// export const addLecture = async (subjectId, userId, lectureData) => {
//     const subject = await loadSubject(subjectId, userId);
//     const lecture = { id: uuidv4(), ...lectureData };
//     subject.courseMaterials.lectures.push(lecture);
//     await subject.save();
//     return lecture;
// };

// /** Get all lectures */
// export const getLectures = async (subjectId, userId) => {
//     const subject = await loadSubject(subjectId, userId);
//     return subject.courseMaterials.lectures;
// };

// /** Update a lecture */
// export const updateLecture = async (subjectId, userId, lectureId, data) => {
//     const subject = await loadSubject(subjectId, userId);
//     const lecture = subject.courseMaterials.lectures.find(l => l.id === lectureId);
//     if (!lecture) throw new Error('Lecture not found');
//     Object.assign(lecture, data);
//     await subject.save();
//     return lecture;
// };

// /** Delete a lecture */
// export const deleteLecture = async (subjectId, userId, lectureId) => {
//     const subject = await loadSubject(subjectId, userId);
//     subject.courseMaterials.lectures = subject.courseMaterials.lectures.filter(l => l.id !== lectureId);
//     await subject.save();
//     return { success: true };
// };

// // ==== READING CRUD ==== //

// /** Add a reading */
// export const addReading = async (subjectId, userId, readingData) => {
//     const subject = await loadSubject(subjectId, userId);
//     const reading = { id: uuidv4(), ...readingData };
//     subject.courseMaterials.readings.push(reading);
//     await subject.save();
//     return reading;
// };

// /** Get all readings */
// export const getReadings = async (subjectId, userId) => {
//     const subject = await loadSubject(subjectId, userId);
//     return subject.courseMaterials.readings;
// };

// /** Update a reading */
// export const updateReading = async (subjectId, userId, readingId, data) => {
//     const subject = await loadSubject(subjectId, userId);
//     const reading = subject.courseMaterials.readings.find(r => r.id === readingId);
//     if (!reading) throw new Error('Reading not found');
//     Object.assign(reading, data);
//     await subject.save();
//     return reading;
// };

// /** Delete a reading */
// export const deleteReading = async (subjectId, userId, readingId) => {
//     const subject = await loadSubject(subjectId, userId);
//     subject.courseMaterials.readings = subject.courseMaterials.readings.filter(r => r.id !== readingId);
//     await subject.save();
//     return { success: true };
// };

// // ==== ASSIGNMENT CRUD ==== //

// /** Add an assignment */
// export const addAssignment = async (subjectId, userId, assignmentData) => {
//     const subject = await loadSubject(subjectId, userId);
//     const assignment = { id: uuidv4(), ...assignmentData };
//     subject.courseMaterials.assignments.push(assignment);
//     await subject.save();
//     return assignment;
// };

// /** Get all assignments */
// export const getAssignments = async (subjectId, userId) => {
//     const subject = await loadSubject(subjectId, userId);
//     return subject.courseMaterials.assignments;
// };

// /** Update an assignment */
// export const updateAssignment = async (subjectId, userId, assignmentId, data) => {
//     const subject = await loadSubject(subjectId, userId);
//     const assignment = subject.courseMaterials.assignments.find(a => a.id === assignmentId);
//     if (!assignment) throw new Error('Assignment not found');
//     Object.assign(assignment, data);
//     await subject.save();
//     return assignment;
// };

// /** Delete an assignment */
// export const deleteAssignment = async (subjectId, userId, assignmentId) => {
//     const subject = await loadSubject(subjectId, userId);
//     subject.courseMaterials.assignments = subject.courseMaterials.assignments.filter(a => a.id !== assignmentId);
//     await subject.save();
//     return { success: true };
// };

// // ==== NOTES CRUD ==== //

// /** Add a note */
// export const addNote = async (subjectId, userId, noteData) => {
//     const subject = await loadSubject(subjectId, userId);
//     const note = { id: uuidv4(), ...noteData };
//     subject.notes.push(note);
//     await subject.save();
//     return note;
// };

// /** Get all notes */
// export const getNotes = async (subjectId, userId) => {
//     const subject = await loadSubject(subjectId, userId);
//     return subject.notes;
// };

// /** Update a note */
// export const updateNote = async (subjectId, userId, noteId, data) => {
//     const subject = await loadSubject(subjectId, userId);
//     const note = subject.notes.find(n => n.id === noteId);
//     if (!note) throw new Error('Note not found');
//     Object.assign(note, data);
//     await subject.save();
//     return note;
// };

// /** Delete a note */
// export const deleteNote = async (subjectId, userId, noteId) => {
//     const subject = await loadSubject(subjectId, userId);
//     subject.notes = subject.notes.filter(n => n.id !== noteId);
//     await subject.save();
//     return { success: true };
// };
