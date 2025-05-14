import { useState, useEffect } from 'react';
import { getToken } from '../utils/authUtils';

/**
 * Custom hook for accessing authentication data
 * @returns {Object} Authentication data and methods
 */
export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Get token from localStorage
        const authToken = getToken();
        setToken(authToken);
        setIsAuthenticated(!!authToken);
    }, []);

    return {
        token,
        isAuthenticated
    };
};

export default useAuth; 