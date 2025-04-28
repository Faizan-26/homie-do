import axios from 'axios';
import { getToken, removeToken } from '../utils/authUtils';

// Use VITE_API_URL from environment variables or fallback to the base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
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
            // Handle specific HTTP errors
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
    getAll: () => api.get('/api/subjects'),
    getById: (id) => api.get(`/api/subjects/${id}`),
    create: (data) => api.post('/api/subjects', data),
    update: (id, data) => {
        // Validate ID before making API call
        if (!id || id === 'null' || id === null) {
            return Promise.reject(new Error('Invalid subject ID for update operation'));
        }
        return api.put(`/api/subjects/${id}`, data);
    },
    delete: (id) => api.delete(`/api/subjects/${id}`),

    // Syllabus endpoint
    getSyllabus: (subjectId) => api.get(`/api/subjects/${subjectId}`),

    // Unit operations
    getUnits: (subjectId) => api.get(`/api/subjects/${subjectId}/units`),
    addUnit: (subjectId, unitData) => {
        // Validate subjectId before making request
        if (!subjectId || subjectId === 'null' || subjectId === null) {
            return Promise.reject(new Error('Invalid subject ID for adding unit'));
        }
        return api.post(`/api/subjects/${subjectId}/units`, unitData);
    },
    updateUnit: (subjectId, unitId, unitData) => {
        // Validate IDs before making request
        if (!subjectId || subjectId === 'null' || subjectId === null) {
            return Promise.reject(new Error('Invalid subject ID for updating unit'));
        }
        if (!unitId || unitId === 'null' || unitId === null) {
            return Promise.reject(new Error('Invalid unit ID for update operation'));
        }
        return api.put(`/api/subjects/${subjectId}/units/${unitId}`, unitData);
    },
    deleteUnit: (subjectId, unitId) => api.delete(`/api/subjects/${subjectId}/units/${unitId}`),

    // Chapter operations
    getChapters: (subjectId, unitId) => api.get(`/api/subjects/${subjectId}/units/${unitId}/chapters`),
    addChapter: (subjectId, unitId, chapterData) => api.post(`/api/subjects/${subjectId}/units/${unitId}/chapters`, chapterData),
    updateChapter: (subjectId, unitId, chapterId, chapterData) => {
        // Validate IDs before making request
        if (!subjectId || !unitId || !chapterId) {
            return Promise.reject(new Error('Invalid IDs for chapter update operation'));
        }
        return api.put(`/api/subjects/${subjectId}/units/${unitId}/chapters/${chapterId}`, chapterData);
    },
    deleteChapter: (subjectId, unitId, chapterId) =>
        api.delete(`/api/subjects/${subjectId}/units/${unitId}/chapters/${chapterId}`),

    // Lecture operations
    getLectures: (subjectId) => api.get(`/api/subjects/${subjectId}/lectures`),
    addLecture: (subjectId, lectureData) => api.post(`/api/subjects/${subjectId}/lectures`, lectureData),
    updateLecture: (subjectId, lectureId, lectureData) => {
        // Validate IDs before making request
        if (!subjectId || !lectureId) {
            return Promise.reject(new Error('Invalid IDs for lecture update operation'));
        }
        return api.put(`/api/subjects/${subjectId}/lectures/${lectureId}`, lectureData);
    },
    deleteLecture: (subjectId, lectureId) => api.delete(`/api/subjects/${subjectId}/lectures/${lectureId}`),

    // Reading operations
    getReadings: (subjectId) => api.get(`/api/subjects/${subjectId}/readings`),
    addReading: (subjectId, readingData) => api.post(`/api/subjects/${subjectId}/readings`, readingData),
    updateReading: (subjectId, readingId, readingData) => {
        // Validate IDs before making request
        if (!subjectId || !readingId) {
            return Promise.reject(new Error('Invalid IDs for reading update operation'));
        }
        return api.put(`/api/subjects/${subjectId}/readings/${readingId}`, readingData);
    },
    deleteReading: (subjectId, readingId) => api.delete(`/api/subjects/${subjectId}/readings/${readingId}`),

    // Assignment operations
    getAssignments: (subjectId) => api.get(`/api/subjects/${subjectId}/assignments`),
    addAssignment: (subjectId, assignmentData) => api.post(`/api/subjects/${subjectId}/assignments`, assignmentData),
    updateAssignment: (subjectId, assignmentId, assignmentData) => {
        // Validate IDs before making request
        if (!subjectId || !assignmentId) {
            return Promise.reject(new Error('Invalid IDs for assignment update operation'));
        }
        return api.put(`/api/subjects/${subjectId}/assignments/${assignmentId}`, assignmentData);
    },
    deleteAssignment: (subjectId, assignmentId) => api.delete(`/api/subjects/${subjectId}/assignments/${assignmentId}`)
};

// Auth API endpoints
export const authApi = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
    googleAuth: (tokenId) => api.post('/auth/google', { tokenId }),
};

export default api; 