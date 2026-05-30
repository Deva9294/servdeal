import { Router } from 'express';
import * as ctrl from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/config', ctrl.getConfig);
router.post('/payu/callback', ctrl.payuCallback);

router.use(protect);
router.post('/order', ctrl.createOrder);
router.post('/verify', ctrl.verifyPayment);
router.get('/wallet', ctrl.getWallet);
router.post('/wallet/topup', ctrl.walletTopUp);

export default router;
