import { Router } from 'express';
import authRoutes from './authRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import providerRoutes from './providerRoutes.js';
import adminRoutes from './adminRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import chatRoutes from './chatRoutes.js';
import aiRoutes from './aiRoutes.js';
import blogRoutes from './blogRoutes.js';
import couponRoutes from './couponRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import userRoutes from './userRoutes.js';
import supportRoutes from './supportRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/providers', providerRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);
router.use('/chat', chatRoutes);
router.use('/ai', aiRoutes);
router.use('/blogs', blogRoutes);
router.use('/coupons', couponRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/users', userRoutes);
router.use('/support', supportRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'ServDeal API is running' });
});

export default router;
