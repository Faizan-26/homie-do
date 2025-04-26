import User from "../models/userModel.js";
import { createUser, findUserByEmail, findUserById } from "../services/userService.js";
import { sendPasswordResetEmail } from "../services/emailService.js";
import crypto from "crypto";
import { verifyGoogleToken, processGoogleSignIn, generateToken } from "../services/authService.js";

// Register new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password || password.length < 6) {
            return res.status(400).json({ message: 'All fields are required and password must be at least 6 characters' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = await createUser({ name, email, password });

        // Generate token
        const token = generateToken(newUser);

        // Send response with token
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePicture: newUser.profilePicture || null
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        // Send response
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture || null
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Google authentication
export const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'Google ID token is required' });
        }

        // Verify the Google token
        const googleUser = await verifyGoogleToken(idToken);

        // Process the Google sign-in
        const { user, token } = await processGoogleSignIn(googleUser);

        // Send response
        res.status(200).json({
            message: 'Google authentication successful',
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Google authentication failed', error: error.message });
    }
};

// Forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user exists
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate password reset token
        const resetToken = await user.generatePasswordResetToken();
        console.log("Reset token: ", resetToken);
        // Send email with reset token
        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        try {
            await sendPasswordResetEmail(user.email, resetURL);

            res.status(200).json({ message: 'Password reset email sent successfully' });
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                message: 'Error sending password reset email',
                error: error.message
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Reset password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Validate input
        if (!password || password.length < 6) {
            return res.status(400).json({
                message: 'Password is required and must be at least 6 characters long'
            });
        }

        // Hash the token from params
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token and non-expired reset token
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        // Update password and clear reset token fields
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        // Generate new token
        const newToken = generateToken(user);

        // Send response
        res.status(200).json({
            message: 'Password reset successful',
            token: newToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture || null
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
    try {
        const user = await findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture || null
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};