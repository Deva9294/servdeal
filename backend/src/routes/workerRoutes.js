import { Router } from 'express';
import * as ctrl from '../controllers/workerController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/nearby', ctrl.getNearbyWorkers);
router.post('/register', protect, restrictTo('worker'), ctrl.registerWorker);
router.get('/me', protect, restrictTo('worker'), ctrl.getMyWorkerProfile);
router.patch('/me', protect, restrictTo('worker'), ctrl.updateMyWorkerProfile);
router.patch('/availability', protect, restrictTo('worker'), ctrl.toggleAvailability);

export default router;


