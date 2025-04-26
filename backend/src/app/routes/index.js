import { Router } from 'express';
const router = Router();
import authRoutes from './authRoutes.js';


router.use('/auth', authRoutes);



export default router;
