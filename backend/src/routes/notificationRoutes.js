import { Router } from 'express';
import * as ctrl from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', ctrl.getNotifications);
router.patch('/read', ctrl.markRead);

export default router;
