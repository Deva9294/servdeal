import { Router } from 'express';
import * as ctrl from '../controllers/jobAlertController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/me', protect, restrictTo('worker'), ctrl.getMyAlerts);
router.post('/:id/respond', protect, restrictTo('worker'), ctrl.respondToAlert);
router.post('/generate', protect, restrictTo('admin'), ctrl.generateNearbyAlerts);
router.post('/', protect, restrictTo('admin'), ctrl.createJobAlert);

export default router;
