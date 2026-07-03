import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as ctrl from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many payment requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/config', ctrl.getConfig);
router.post('/payu/callback', protect, ctrl.payuCallback);

router.use(protect);
router.post('/order', paymentLimiter, ctrl.createOrder);
router.post('/verify', paymentLimiter, ctrl.verifyPayment);

export default router;
