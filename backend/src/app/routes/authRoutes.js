import { Router } from 'express';
import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    googleAuth,
    getCurrentUser
} from '../controller/authController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', authenticateJWT, getCurrentUser);

export default router;