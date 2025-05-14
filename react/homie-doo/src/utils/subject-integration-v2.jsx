import SubjectModel from "../models/subjectModel";
import { subjectApi } from "../services/apiV2";

// Lecture Handlers
export const addLectureHandler = async (subjectId, lectureData) => {
    try {
        const response = await subjectApi.addLecture(subjectId, lectureData);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error adding lecture:', error);
        return null;
    }
}

export const updateLectureHandler = async (subjectId, lectureId, lectureData) => {
    try {
        const response = await subjectApi.updateLecture(subjectId, lectureId, lectureData);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error updating lecture:', error);
        return null;
    }
}

export const deleteLectureHandler = async (subjectId, lectureId) => {
    try {
        const response = await subjectApi.deleteLecture(subjectId, lectureId);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error deleting lecture:', error);
        return null;
    }
}

// Reading Handlers
export const addReadingHandler = async (subjectId, readingData) => {
    try {
        const response = await subjectApi.addReading(subjectId, readingData);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error adding reading:', error);
        return null;
    }
}

export const updateReadingHandler = async (subjectId, readingId, readingData) => {
    try {
        const response = await subjectApi.updateReading(subjectId, readingId, readingData);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error updating reading:', error);
        return null;
    }
}

export const deleteReadingHandler = async (subjectId, readingId) => {
    try {
        const response = await subjectApi.deleteReading(subjectId, readingId);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error deleting reading:', error);
        return null;
    }
}

// Assignment Handlers
export const addAssignmentHandler = async (subjectId, assignmentData) => {
    try {
        const response = await subjectApi.addAssignment(subjectId, assignmentData);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error adding assignment:', error);
        return null;
    }
}

export const updateAssignmentHandler = async (subjectId, assignmentId, assignmentData) => {
    try {
        const response = await subjectApi.updateAssignment(subjectId, assignmentId, assignmentData);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error updating assignment:', error);
        return null;
    }
}

export const deleteAssignmentHandler = async (subjectId, assignmentId) => {
    try {
        const response = await subjectApi.deleteAssignment(subjectId, assignmentId);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error deleting assignment:', error);
        return null;
    }
}

// Note Handlers
export const addNoteHandler = async (subjectId, noteData) => {
    try {
        const response = await subjectApi.addNote(subjectId, noteData);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error adding note:', error);
        return null;
    }
}

export const updateNoteHandler = async (subjectId, noteId, noteData) => {
    try {
        const response = await subjectApi.updateNote(subjectId, noteId, noteData);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error updating note:', error);
        return null;
    }
}

export const deleteNoteHandler = async (subjectId, noteId) => {
    try {
        const response = await subjectApi.deleteNote(subjectId, noteId);
        return SubjectModel.fromBackend(response.data);
    } catch (error) {
        console.error('Error deleting note:', error);
        return null;
    }
}

