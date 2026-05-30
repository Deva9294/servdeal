import { Router } from 'express';
import * as ctrl from '../controllers/matchingController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.get('/jobs', protect, restrictTo('worker'), ctrl.matchJobsForWorker);
router.get('/workers/:bookingId', protect, restrictTo('admin', 'customer'), ctrl.matchWorkersForBooking);

export default router;
