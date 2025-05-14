// filepath: d:\Study\Sem 6\web\homie-do\react\homie-doo\src\services\subjectServiceV2.js
import { subjectApi } from './apiV2.js';
import { SubjectModel } from '../models/subjectModel.js';

/**
 * Subject Service - Provides an interface for UI components to interact with subject data
 * This service calls the API endpoints and handles data transformation using SubjectModel
 */
export const subjectService = {
    // Get all subjects for the current user
    getAllSubjects: async () => {
        try {
            const response = await subjectApi.getAll();
            if (response.status !== 200) {
                throw new Error('Failed to fetch subjects');
            }
            console.log('Fetched subjects:', response.data);
            return response.data.map(subject => SubjectModel.fromBackend(subject)); // returns an array of SubjectModel instances
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw error;
        }
    },

    // Create a new subject
    createSubject: async (subjectData) => {
        try {
            const response = await subjectApi.create(subjectData);
            if (response.status !== 201) {
                throw new Error('Failed to create subject');
            }

            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error('Error creating subject:', error);
            throw error;
        }
    },

    // Delete a subject by ID
    deleteSubject: async (subjectId) => {
        try {
            const response = await subjectApi.delete(subjectId);
            if (response.status !== 200) {
                throw new Error('Failed to delete subject');
            }
            return response.data;
        } catch (error) {
            console.error(`Error deleting subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Add lecture to a subject
    addLecture: async (subjectId, lectureData) => {
        try {
            const response = await subjectApi.addLecture(subjectId, lectureData);
            if (response.status !== 201) {
                throw new Error('Failed to add lecture');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error adding lecture to subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Edit lecture in a subject
    editLecture: async (subjectId, lectureId, lectureData) => {
        try {
            const response = await subjectApi.updateLecture(subjectId, lectureId, lectureData);
            if (response.status !== 200) {
                throw new Error('Failed to update lecture');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error updating lecture ${lectureId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Delete lecture from a subject
    deleteLecture: async (subjectId, lectureId) => {
        try {
            const response = await subjectApi.deleteLecture(subjectId, lectureId);
            if (response.status !== 200) {
                throw new Error('Failed to delete lecture');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error deleting lecture ${lectureId} from subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Add reading to a subject
    addReading: async (subjectId, readingData) => {
        try {
            const response = await subjectApi.addReading(subjectId, readingData);
            if (response.status !== 201) {
                throw new Error('Failed to add reading');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error adding reading to subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Edit reading in a subject
    editReading: async (subjectId, readingId, readingData) => {
        try {
            const response = await subjectApi.updateReading(subjectId, readingId, readingData);
            if (response.status !== 200) {
                throw new Error('Failed to update reading');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error updating reading ${readingId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Delete reading from a subject
    deleteReading: async (subjectId, readingId) => {
        try {
            const response = await subjectApi.deleteReading(subjectId, readingId);
            if (response.status !== 200) {
                throw new Error('Failed to delete reading');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error deleting reading ${readingId} from subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Add assignment to a subject
    addAssignment: async (subjectId, assignmentData) => {
        try {
            const response = await subjectApi.addAssignment(subjectId, assignmentData);
            if (response.status !== 201) {
                throw new Error('Failed to add assignment');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error adding assignment to subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Edit assignment in a subject
    editAssignment: async (subjectId, assignmentId, assignmentData) => {
        try {
            const response = await subjectApi.updateAssignment(subjectId, assignmentId, assignmentData);
            if (response.status !== 200) {
                throw new Error('Failed to update assignment');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error updating assignment ${assignmentId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Delete assignment from a subject
    deleteAssignment: async (subjectId, assignmentId) => {
        try {
            const response = await subjectApi.deleteAssignment(subjectId, assignmentId);
            if (response.status !== 200) {
                throw new Error('Failed to delete assignment');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error deleting assignment ${assignmentId} from subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Add note to a subject
    addNote: async (subjectId, noteData) => {
        try {
            const response = await subjectApi.addNote(subjectId, noteData);
            if (response.status !== 201) {
                throw new Error('Failed to add note');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error adding note to subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Edit note in a subject
    editNote: async (subjectId, noteId, noteData) => {
        try {
            const response = await subjectApi.updateNote(subjectId, noteId, noteData);
            if (response.status !== 200) {
                throw new Error('Failed to update note');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error updating note ${noteId} in subject ${subjectId}:`, error);
            throw error;
        }
    },

    // Delete note from a subject
    deleteNote: async (subjectId, noteId) => {
        try {
            const response = await subjectApi.deleteNote(subjectId, noteId);
            if (response.status !== 200) {
                throw new Error('Failed to delete note');
            }
            return SubjectModel.fromBackend(response.data);
        } catch (error) {
            console.error(`Error deleting note ${noteId} from subject ${subjectId}:`, error);
            throw error;
        }
    }
};