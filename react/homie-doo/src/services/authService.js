
import { authApi } from './api';
import { User } from '../models/userModel';
import { setToken, removeToken, isAuthenticated } from '../utils/authUtils';

/**
 * Service to handle authentication API calls
 */
class AuthService {
    /**
     * Register a new user
     */
    async register(userData) {
        try {
            const response = await authApi.register(userData);

            // Store auth token if it's returned
            if (response.data.token) {
                setToken(response.data.token);
            }

            // Store user in local storage if user data is returned
            if (response.data.user) {
                const user = User.fromJSON(response.data.user);
                User.StoreToLocalStorage(user);
            }

            return response.data;
        } catch (error) {
            console.error('Error registering user:', error);
            throw error;
        }
    }

    /**
     * Login a user
     */
    async login(credentials) {
        try {
            const response = await authApi.login(credentials);

            // Store auth token
            if (response.data.token) {
                setToken(response.data.token);
            }

            // Store user in local storage
            if (response.data.user) {
                const user = User.fromJSON(response.data.user);
                User.StoreToLocalStorage(user);
            }

            return response.data;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    }

    /**
     * Logout the current user
     */
    logout() {
        // Remove auth token and user from local storage
        removeToken();
        User.ClearLocalStorage();
    }

    /**
     * Get the current authenticated user profile
     */
    async getCurrentUser() {
        try {
            const response = await authApi.profile();

            // Update stored user
            if (response.data.user) {
                const user = User.fromJSON(response.data.user);
                User.StoreToLocalStorage(user);
            }

            return response.data.user;
        } catch (error) {
            console.error('Error fetching current user:', error);

            // If authentication error, log out
            if (error.response && error.response.status === 401) {
                this.logout();
            }

            throw error;
        }
    }

    isLoggedIn() {
        return User.IsLoggedIn() && isAuthenticated();
    }

    async forgotPassword(email) {
        try {
            const response = await authApi.forgotPassword(email);
            return response.data;
        } catch (error) {
            console.error('Error requesting password reset:', error);
            throw error;
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const response = await authApi.resetPassword(token, newPassword);
            return response.data;
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }

    
    async googleAuth(tokenId) {
        try {
            const response = await authApi.googleAuth(tokenId);

            // Store auth token
            if (response.data.token) {
                setToken(response.data.token);
            }

            // Store user in local storage
            if (response.data.user) {
                const user = User.fromJSON(response.data.user);
                User.StoreToLocalStorage(user);
            }

            return response.data;
        } catch (error) {
            console.error('Error authenticating with Google:', error);
            throw error;
        }
    }
}

export default new AuthService(); 