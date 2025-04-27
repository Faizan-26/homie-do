import { subjectApi } from './api';

/**
 * Subject Service
 * Provides methods for interacting with subject data through the API
 */
export const subjectService = {
    // Subject CRUD
    getAllSubjects: async () => {
        try {
            const response = await subjectApi.getAll();
            return response.data;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw error;
        }
    },

    getSubjectById: async (id) => {
        try {
            const response = await subjectApi.getById(id);
            return response.data;
        } catch (error) {
            console.error(`Error fetching subject ${id}:`, error);
            throw error;
        }
    },

    createSubject: async (subjectData) => {
        try {
            const response = await subjectApi.create(subjectData);
            return response.data;
        } catch (error) {
            console.error('Error creating subject:', error);
            throw error;
        }
    },

    updateSubject: async (id, updateData) => {
        try {
            const response = await subjectApi.update(id, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating subject ${id}:`, error);
            throw error;
        }
    },

    deleteSubject: async (id) => {
        try {
            await subjectApi.delete(id);
            return true;
        } catch (error) {
            console.error(`Error deleting subject ${id}:`, error);
            throw error;
        }
    },

    // Syllabus operations
    getSyllabusById: async (syllabusId) => {
        try {
            const response = await subjectApi.getSyllabus(syllabusId);
            return response.data;
        } catch (error) {
            console.error(`Error fetching syllabus ${syllabusId}:`, error);
            throw error;
        }
    },

    // Unit operations
    getUnits: async (subjectId) => {
        try {
            const response = await subjectApi.getUnits(subjectId);
            return response.data;
        } catch (error) {
            console.error(`Error fetching units for subject ${subjectId}:`, error);
            throw error;
        }
    },

    addUnit: async (subjectId, unitData) => {
        try {
            // No longer stripping IDs - backend will handle this correctly
            const response = await subjectApi.addUnit(subjectId, unitData);
            return response.data;
        } catch (error) {
            console.error(`Error adding unit to subject ${subjectId}:`, error);
            throw error;
        }
    },

    updateUnit: async (subjectId, unitId, unitData) => {
        try {
            const response = await subjectApi.updateUnit(subjectId, unitId, unitData);
            return response.data;
        } catch (error) {
            console.error(`Error updating unit ${unitId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    deleteUnit: async (subjectId, unitId) => {
        try {
            await subjectApi.deleteUnit(subjectId, unitId);
            return true;
        } catch (error) {
            console.error(`Error deleting unit ${unitId} from subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Chapter operations
    getChapters: async (subjectId, unitId) => {
        try {
            const response = await subjectApi.getChapters(subjectId, unitId);
            return response.data;
        } catch (error) {
            console.error(`Error fetching chapters for unit ${unitId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    addChapter: async (subjectId, unitId, chapterData) => {
        try {
            // No longer stripping IDs - backend will handle this correctly
            const response = await subjectApi.addChapter(subjectId, unitId, chapterData);
            return response.data;
        } catch (error) {
            console.error(`Error adding chapter to unit ${unitId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    updateChapter: async (subjectId, unitId, chapterId, chapterData) => {
        try {
            const response = await subjectApi.updateChapter(subjectId, unitId, chapterId, chapterData);
            return response.data;
        } catch (error) {
            console.error(`Error updating chapter ${chapterId} in unit ${unitId} of subject ${subjectId}:`, error);
            throw error;
        }
    },

    deleteChapter: async (subjectId, unitId, chapterId) => {
        try {
            await subjectApi.deleteChapter(subjectId, unitId, chapterId);
            return true;
        } catch (error) {
            console.error(`Error deleting chapter ${chapterId} from unit ${unitId}:`, error);
            throw error;
        }
    },

    // Lecture operations
    getLectures: async (subjectId) => {
        try {
            const response = await subjectApi.getLectures(subjectId);
            return response.data;
        } catch (error) {
            console.error(`Error fetching lectures for subject ${subjectId}:`, error);
            throw error;
        }
    },

    addLecture: async (subjectId, lectureData) => {
        try {
            // No longer stripping IDs - backend will handle this correctly
            const response = await subjectApi.addLecture(subjectId, lectureData);
            return response.data;
        } catch (error) {
            console.error(`Error adding lecture to subject ${subjectId}:`, error);
            throw error;
        }
    },

    updateLecture: async (subjectId, lectureId, lectureData) => {
        try {
            const response = await subjectApi.updateLecture(subjectId, lectureId, lectureData);
            return response.data;
        } catch (error) {
            console.error(`Error updating lecture ${lectureId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    deleteLecture: async (subjectId, lectureId) => {
        try {
            await subjectApi.deleteLecture(subjectId, lectureId);
            return true;
        } catch (error) {
            console.error(`Error deleting lecture ${lectureId} from subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Reading operations
    getReadings: async (subjectId) => {
        try {
            const response = await subjectApi.getReadings(subjectId);
            return response.data;
        } catch (error) {
            console.error(`Error fetching readings for subject ${subjectId}:`, error);
            throw error;
        }
    },

    addReading: async (subjectId, readingData) => {
        try {
            // No longer stripping IDs - backend will handle this correctly
            const response = await subjectApi.addReading(subjectId, readingData);
            return response.data;
        } catch (error) {
            console.error(`Error adding reading to subject ${subjectId}:`, error);
            throw error;
        }
    },

    updateReading: async (subjectId, readingId, readingData) => {
        try {
            const response = await subjectApi.updateReading(subjectId, readingId, readingData);
            return response.data;
        } catch (error) {
            console.error(`Error updating reading ${readingId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    deleteReading: async (subjectId, readingId) => {
        try {
            await subjectApi.deleteReading(subjectId, readingId);
            return true;
        } catch (error) {
            console.error(`Error deleting reading ${readingId} from subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Assignment operations
    getAssignments: async (subjectId) => {
        try {
            const response = await subjectApi.getAssignments(subjectId);
            return response.data;
        } catch (error) {
            console.error(`Error fetching assignments for subject ${subjectId}:`, error);
            throw error;
        }
    },

    addAssignment: async (subjectId, assignmentData) => {
        try {
            // No longer stripping IDs - backend will handle this correctly
            const response = await subjectApi.addAssignment(subjectId, assignmentData);
            return response.data;
        } catch (error) {
            console.error(`Error adding assignment to subject ${subjectId}:`, error);
            throw error;
        }
    },

    updateAssignment: async (subjectId, assignmentId, assignmentData) => {
        try {
            const response = await subjectApi.updateAssignment(subjectId, assignmentId, assignmentData);
            return response.data;
        } catch (error) {
            console.error(`Error updating assignment ${assignmentId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    deleteAssignment: async (subjectId, assignmentId) => {
        try {
            await subjectApi.deleteAssignment(subjectId, assignmentId);
            return true;
        } catch (error) {
            console.error(`Error deleting assignment ${assignmentId} from subject ${subjectId}:`, error);
            throw error;
        }
    }
};

export default subjectService;
