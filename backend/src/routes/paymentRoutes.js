import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as ctrl from '../controllers/paymentController.js';
import * as walletCtrl from '../controllers/walletController.js';
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
router.post('/payu/callback', ctrl.payuCallback);

router.use(protect);
router.post('/order', paymentLimiter, ctrl.createOrder);
router.post('/verify', paymentLimiter, ctrl.verifyPayment);
router.get('/wallet', ctrl.getWallet);
router.get('/wallet/transactions', ctrl.getWalletTransactions);
router.post('/wallet/topup', ctrl.walletTopUp);
router.get('/wallet/stats', walletCtrl.getWalletStats);

export default router;
