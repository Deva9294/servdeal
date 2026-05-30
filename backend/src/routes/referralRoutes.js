import { Router } from 'express';
import * as ctrl from '../controllers/referralController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/me', protect, ctrl.getMyReferrals);
router.post('/claim', protect, ctrl.claimReferral);
router.post('/process-booking', protect, ctrl.processBookingReferral);

export default router;
