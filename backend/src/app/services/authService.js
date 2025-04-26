import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { findUserByEmail, findUserByGoogleId, createUser } from './userService.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google ID token
 * @param {string} idToken - The Google ID token
 * @returns {Object} User info from Google
 */
export const verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        return ticket.getPayload();
    } catch (error) {
        throw new Error('Invalid Google token: ' + error.message);
    }
};

/**
 * Process Google Sign In - Find or create user based on Google data
 * @param {Object} googleUser - User data from Google
 * @returns {Object} User object and auth token
 */
export const processGoogleSignIn = async (googleUser) => {
    const { email, name, sub: googleId, picture } = googleUser;

    // Try to find user by email or Google ID
    let user = await findUserByEmail(email) || await findUserByGoogleId(googleId);

    if (!user) {
        // Create new user if doesn't exist
        const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

        user = await createUser({
            name,
            email,
            password: randomPassword,
            googleId,
            profilePicture: picture || null
        });
    } else if (!user.googleId) {
        // Update existing user with Google ID
        user.googleId = googleId;
        await user.save();
    }

    // Generate JWT token
    const token = generateToken(user);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture || null
        },
        token
    };
};

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token: ' + error.message);
    }
};
