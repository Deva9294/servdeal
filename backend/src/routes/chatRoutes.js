import { Router } from 'express';
import * as ctrl from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', ctrl.getChats);
router.post('/', ctrl.getOrCreateChat);
router.post('/:id/messages', ctrl.sendMessage);

export default router;
