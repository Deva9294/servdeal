import { Router } from 'express';
import * as ctrl from '../controllers/adminController.js';
import * as booking from '../controllers/bookingController.js';
import * as walletCtrl from '../controllers/walletController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

router.use(protect, restrictTo('admin', 'superadmin'));

router.get('/dashboard', ctrl.getDashboardStats);
router.get('/users', ctrl.getUsers);
router.patch('/users/:id', ctrl.updateUser);
router.get('/providers', ctrl.getProviders);
router.patch('/providers/:id/approve', ctrl.approveProvider);
router.get('/bookings', booking.getAllBookings);
router.get('/wallet/transactions', walletCtrl.getAllWalletTransactions);
router.get('/wallet/payment-logs', walletCtrl.getPaymentLogs);
router.get('/wallet/failed-payments', walletCtrl.getFailedPayments);
router.get('/analytics/retention', ctrl.getCustomerRetentionAnalytics);

export default router;
