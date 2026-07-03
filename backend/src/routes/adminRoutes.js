import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as ctrl from '../controllers/adminController.js';
import * as booking from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests from this admin' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(protect, restrictTo('admin', 'superadmin'), adminLimiter);
router.get('/dashboard', ctrl.getDashboardStats);
router.get('/users', ctrl.getUsers);
router.patch('/users/:id', ctrl.updateUser);
router.get('/providers', ctrl.getProviders);
router.get('/providers/pending', ctrl.getPendingVerifications);
router.patch('/providers/:id/verify', ctrl.verifyProvider);
router.get('/bookings', booking.getAllBookings);
router.get('/analytics/retention', ctrl.getCustomerRetentionAnalytics);

export default router;
