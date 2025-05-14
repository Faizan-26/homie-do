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

// Auth API endpoints
export const authApi = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
    googleAuth: (tokenId) => api.post('/auth/google', { tokenId }),
};

export default api; 