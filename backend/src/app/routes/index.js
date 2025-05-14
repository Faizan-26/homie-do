import { Router } from 'express';
import authRoutes from './authRoutes.js';
import subjectRouterV2 from './subjectRoutesV2.js';
import chatbotRouter from './chatbotRoutes.js';

const router = Router();

// Test route to check API connectivity
router.get('/test', (req, res) => {
    console.log('Test API endpoint hit');
    res.status(200).json({ message: 'API is working correctly' });
});


router.use('/auth', authRoutes);
router.use('/subjectsV2', subjectRouterV2);
router.use('/chatbot', chatbotRouter);
export default router;
