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
import workerRoutes from './workerRoutes.js';
import employerRoutes from './employerRoutes.js';
import jobPostRoutes from './jobPostRoutes.js';
import skillRoutes from './skillRoutes.js';
import providerProfileRoutes from './providerProfileRoutes.js';
import workerCardRoutes from './workerCardRoutes.js';
import badgeRoutes from './badgeRoutes.js';
import workHistoryRoutes from './workHistoryRoutes.js';
import jobAlertRoutes from './jobAlertRoutes.js';
import teamRoutes from './teamRoutes.js';
import trainingRoutes from './trainingRoutes.js';
import toolRoutes from './toolRoutes.js';
import referralRoutes from './referralRoutes.js';
import matchingRoutes from './matchingRoutes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'ServDeal API is running', timestamp: new Date().toISOString() });
});

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
router.use('/workers', workerRoutes);
router.use('/employers', employerRoutes);
router.use('/jobs', jobPostRoutes);
router.use('/skills', skillRoutes);
router.use('/providers', providerProfileRoutes);
router.use('/worker-cards', workerCardRoutes);
router.use('/badges', badgeRoutes);
router.use('/work-history', workHistoryRoutes);
router.use('/job-alerts', jobAlertRoutes);
router.use('/teams', teamRoutes);
router.use('/training', trainingRoutes);
router.use('/tools', toolRoutes);
router.use('/referrals', referralRoutes);
router.use('/matching', matchingRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'ServDeal API is running' });
});

export default router;
