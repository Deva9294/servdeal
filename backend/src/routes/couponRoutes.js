import { Router } from 'express';
import * as ctrl from '../controllers/couponController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', ctrl.getCoupons);
router.post('/validate', protect, ctrl.validateCoupon);

export default router;
