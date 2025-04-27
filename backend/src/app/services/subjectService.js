import Subject from '../models/subjectModel.js';

// Subject CRUD operations
export const createSubject = async (subjectData) => {
    try {
        const subject = new Subject(subjectData);
        await subject.save();
        return subject;
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
        console.log("subject PIk", subject);

        subject.courseMaterials.syllabus.units.push(unitData);
        await subject.save();

        return subject.courseMaterials.syllabus.units[subject.courseMaterials.syllabus.units.length - 1];
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
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        const unitIndex = subject.courseMaterials.syllabus.units.findIndex(
            unit => unit.id === unitId
        );

        if (unitIndex === -1) throw new Error('Unit not found');

        Object.assign(subject.courseMaterials.syllabus.units[unitIndex], updateData);
        await subject.save();

        return subject.courseMaterials.syllabus.units[unitIndex];
    } catch (error) {
        throw new Error(`Error updating unit: ${error.message}`);
    }
};

export const deleteUnit = async (subjectId, userId, unitId) => {
    try {
        const subject = await Subject.findOne({ _id: subjectId, user: userId });
        if (!subject) throw new Error('Subject not found');

        subject.courseMaterials.syllabus.units = subject.courseMaterials.syllabus.units.filter(
            unit => unit.id !== unitId
        );

        await subject.save();
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

        Object.assign(unit.chapters[chapterIndex], updateData);
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

        // Keep the original ID
        const originalId = subject.courseMaterials.lectures[lectureIndex].id;
        Object.assign(subject.courseMaterials.lectures[lectureIndex], updateData);
        subject.courseMaterials.lectures[lectureIndex].id = originalId;

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

        // Keep the original ID
        const originalId = subject.courseMaterials.readings[readingIndex].id;
        Object.assign(subject.courseMaterials.readings[readingIndex], updateData);
        subject.courseMaterials.readings[readingIndex].id = originalId;

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

        // Keep the original ID
        const originalId = subject.courseMaterials.assignments[assignmentIndex].id;
        Object.assign(subject.courseMaterials.assignments[assignmentIndex], updateData);
        subject.courseMaterials.assignments[assignmentIndex].id = originalId;

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


