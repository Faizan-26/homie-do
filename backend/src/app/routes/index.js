import { Router } from 'express';
import authRoutes from './authRoutes.js';
import subjectRoutes from './subjectRoutes.js';
import subjectRouterV2 from './subjectRoutesV2.js';

const router = Router();

// Test route to check API connectivity
router.get('/test', (req, res) => {
    console.log('Test API endpoint hit');
    res.status(200).json({ message: 'API is working correctly' });
});


// Register all routes
router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/subjectsV2', subjectRouterV2);
export default router;
