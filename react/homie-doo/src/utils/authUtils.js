/**
 * Authentication Utilities
 * Helper functions for authentication-related operations
 */

/**
 * Get the JWT token from localStorage
 * @returns {string|null} The JWT token or null if not found
 */
export const getToken = () => {
    return localStorage.getItem('token');
};

/**
 * Check if user is authenticated (has token in localStorage)
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
    return getToken() !== null;
};

/**
 * Remove authentication token from localStorage (logout)
 */
export const removeToken = () => {
    localStorage.removeItem('token');
};

/**
 * Set authentication token in localStorage
 * @param {string} token - The JWT token to store
 */
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

/**
 * Get headers with authorization token for fetch API
 * @returns {Object} Headers object with Authorization token if available
 */
export const getAuthHeaders = () => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};

export const getLoggedInUserId = () => {
   const userInfo = localStorage.getItem('user');
    if (userInfo) {
         const user = JSON.parse(userInfo);
         return user.id; // Assuming the user object has an 'id' property
    }
    return null;
}

/**
 * Parse token payload (without verification)
 * This is NOT secure for authentication purposes but can be used for UI decisions
 * @param {string} token - JWT token
 * @returns {Object|null} The decoded payload or null if invalid
 */
export const parseToken = (token) => {
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Failed to parse token:', e);
        return null;
    }
};

export default {
    getToken,
    isAuthenticated,
    removeToken,
    setToken,
    getAuthHeaders,
    parseToken
}; 