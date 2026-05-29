import { Router } from 'express';
import * as ctrl from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/chatbot', ctrl.chatbot);
router.get('/search', ctrl.search);
router.get('/pricing/:serviceId', ctrl.pricing);
router.get('/recommendations', protect, ctrl.recommendations);

export default router;
