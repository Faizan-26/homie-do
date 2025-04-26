// Function to set auth token in localStorage
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

// Function to get auth token from localStorage
export const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Function to set user data in localStorage
export const setUserData = (userData) => {
    if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
    } else {
        localStorage.removeItem('user');
    }
};

// Function to get user data from localStorage
export const getUserData = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
    return !!getAuthToken();
};

// Function to handle authentication headers for fetch
export const authHeader = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Function to clear auth data on logout
export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// API calls
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5500';

// Login user
export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Login failed');
    }

    // Store auth data
    setAuthToken(data.token);
    setUserData(data.user);

    return data;
};

// Register user
export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    // Store auth data
    setAuthToken(data.token);
    setUserData(data.user);

    return data;
};

// Google login
export const googleLogin = async (idToken) => {
    const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken }),
        credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
    }

    // Store auth data
    setAuthToken(data.token);
    setUserData(data.user);

    return data;
};

// Forgot password
export const forgotPassword = async (email) => {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
    }

    return data;
};

// Reset password
export const resetPassword = async (token, password) => {
    const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
    }

    return data;
}; 