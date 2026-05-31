import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  getRankedProviders,
  triggerAutoAssign,
  providerAcceptBooking,
  providerRejectBooking,
  createEmergencyBooking,
  getDynamicPrice,
  createPricingRule,
  getPricingRules,
  generateStartOTP,
  verifyStartOTP,
  generateCompleteOTP,
  verifyCompleteOTP,
  getSubscriptionPlans,
  createSubscriptionPlan,
  subscribeToPlan,
  getMySubscription,
  getWorkerWallet,
  requestWithdrawal,
  getWithdrawals,
  updateWithdrawalStatus,
  runTrustCheck,
  getTrustReports,
  updateTrustReport,
  getAnalytics,
  updateProviderLocation,
} from '../controllers/enterpriseController.js';

const router = Router();

// Smart Ranking
router.get('/ranked-providers', getRankedProviders);

// Auto Assignment
router.post('/bookings/:id/auto-assign', protect, restrictTo('admin', 'customer'), triggerAutoAssign);
router.post('/bookings/:id/accept', protect, restrictTo('provider'), providerAcceptBooking);
router.post('/bookings/:id/reject', protect, restrictTo('provider'), providerRejectBooking);

// Emergency Booking
router.post('/emergency-booking', protect, restrictTo('customer'), createEmergencyBooking);

// Dynamic Pricing
router.post('/pricing/calculate', protect, getDynamicPrice);
router.get('/pricing/rules', protect, restrictTo('admin'), getPricingRules);
router.post('/pricing/rules', protect, restrictTo('admin'), createPricingRule);

// OTP Security
router.post('/bookings/:id/otp/start', protect, generateStartOTP);
router.post('/bookings/:id/otp/start/verify', protect, verifyStartOTP);
router.post('/bookings/:id/otp/complete', protect, generateCompleteOTP);
router.post('/bookings/:id/otp/complete/verify', protect, verifyCompleteOTP);

// Subscriptions
router.get('/subscriptions/plans', getSubscriptionPlans);
router.post('/subscriptions/plans', protect, restrictTo('admin'), createSubscriptionPlan);
router.post('/subscriptions/subscribe', protect, subscribeToPlan);
router.get('/subscriptions/my', protect, getMySubscription);

// Worker Wallet & Withdrawals
router.get('/wallet/worker', protect, restrictTo('provider', 'worker'), getWorkerWallet);
router.post('/withdrawals', protect, restrictTo('provider', 'worker'), requestWithdrawal);
router.get('/withdrawals', protect, getWithdrawals);
router.patch('/withdrawals/:id', protect, restrictTo('admin'), updateWithdrawalStatus);

// Trust & Safety
router.post('/trust/check', protect, restrictTo('admin'), runTrustCheck);
router.get('/trust/reports', protect, restrictTo('admin'), getTrustReports);
router.patch('/trust/reports/:id', protect, restrictTo('admin'), updateTrustReport);

// Analytics
router.get('/analytics', protect, getAnalytics);

// Real-Time Tracking
router.post('/location/update', protect, restrictTo('provider', 'worker'), updateProviderLocation);

export default router;
