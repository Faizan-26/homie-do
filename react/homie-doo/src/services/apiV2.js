import axios from 'axios';
import { getToken, removeToken } from '../utils/authUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor to handle common errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    removeToken();
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    break;
                case 404:
                    console.error('Resource not found:', error.response.data);
                    break;
                case 500:
                    console.error('Server error:', error.response.data);
                    break;
                default:
                    console.error('API error:', error.response.data);
                    console.error('Unexpected error occurred:', error);
            }
        } else if (error.request) {
            // Network error
            console.error('Network error - no response received');
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

// Subject API endpoints 
export const subjectApi = {
    // Subject CRUD
    getAll: () => api.get('/api/subjectsV2'),
    create: (data) => api.post('/api/subjectsV2', data),
    delete: (id) => api.delete(`/api/subjectsV2/${id}`),

    // Lecture operations
    addLecture: (subjectId, lectureData) => {
        // Validate ID before making request
        if (!subjectId) {
            return Promise.reject(new Error('Invalid subject ID for adding lecture'));
        }
        return api.post(`/api/subjectsV2/${subjectId}/lecture`, lectureData);
    },
    updateLecture: (subjectId, lectureId, lectureData) => {
        // Validate IDs before making request
        if (!subjectId || !lectureId) {
            return Promise.reject(new Error('Invalid IDs for lecture update operation'));
        }
        return api.put(`/api/subjectsV2/${subjectId}/lecture/${lectureId}`, lectureData);
    },
    deleteLecture: (subjectId, lectureId) => {
        if (!subjectId || !lectureId) {
            return Promise.reject(new Error('Invalid IDs for deleting lecture'));
        }
        return api.delete(`/api/subjectsV2/${subjectId}/lecture/${lectureId}`);
    },

    // Reading operations
    addReading: (subjectId, readingData) => {
        // Validate ID before making request
        if (!subjectId) {
            return Promise.reject(new Error('Invalid subject ID for adding reading'));
        }
        return api.post(`/api/subjectsV2/${subjectId}/reading`, readingData);
    },
    updateReading: (subjectId, readingId, readingData) => {
        // Validate IDs before making request
        if (!subjectId || !readingId) {
            return Promise.reject(new Error('Invalid IDs for reading update operation'));
        }
        return api.put(`/api/subjectsV2/${subjectId}/reading/${readingId}`, readingData);
    },
    deleteReading: (subjectId, readingId) => {
        if (!subjectId || !readingId) {
            return Promise.reject(new Error('Invalid IDs for deleting reading'));
        }
        return api.delete(`/api/subjectsV2/${subjectId}/reading/${readingId}`);
    },

    // Assignment operations
    addAssignment: (subjectId, assignmentData) => {
        // Validate ID before making request
        if (!subjectId) {
            return Promise.reject(new Error('Invalid subject ID for adding assignment'));
        }
        return api.post(`/api/subjectsV2/${subjectId}/assignment`, assignmentData);
    },
    updateAssignment: (subjectId, assignmentId, assignmentData) => {
        // Validate IDs before making request
        if (!subjectId || !assignmentId) {
            return Promise.reject(new Error('Invalid IDs for assignment update operation'));
        }
        return api.put(`/api/subjectsV2/${subjectId}/assignment/${assignmentId}`, assignmentData);
    },
    deleteAssignment: (subjectId, assignmentId) => {
        if (!subjectId || !assignmentId) {
            return Promise.reject(new Error('Invalid IDs for deleting assignment'));
        }
        return api.delete(`/api/subjectsV2/${subjectId}/assignment/${assignmentId}`);
    },

    // Note operations
    addNote: (subjectId, noteData) => {
        // Validate ID before making request
        if (!subjectId) {
            return Promise.reject(new Error('Invalid subject ID for adding note'));
        }
        return api.post(`/api/subjectsV2/${subjectId}/note`, noteData);
    },
    updateNote: (subjectId, noteId, noteData) => {
        // Validate IDs before making request
        if (!subjectId || !noteId) {
            return Promise.reject(new Error('Invalid IDs for note update operation'));
        }
        return api.put(`/api/subjectsV2/${subjectId}/note/${noteId}`, noteData);
    },
    deleteNote: (subjectId, noteId) => {
        if (!subjectId || !noteId) {
            return Promise.reject(new Error('Invalid IDs for deleting note'));
        }
        return api.delete(`/api/subjectsV2/${subjectId}/note/${noteId}`);
    }
};


export default api; 