import { Router } from 'express';
import authRoutes from './authRoutes.js';
import subjectRoutes from './subjectRoutes.js';

const router = Router();

// Test route to check API connectivity
router.get('/test', (req, res) => {
    console.log('Test API endpoint hit');
    res.status(200).json({ message: 'API is working correctly' });
});


// Register all routes
router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
export default router;
