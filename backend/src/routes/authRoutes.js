import { Router } from 'express';
import * as auth from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { otpSendLimiter, otpVerifyLimiter } from '../middleware/otpLimiter.js';

const router = Router();

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/otp/send', otpSendLimiter, auth.sendOtp);
router.post('/otp/verify', otpVerifyLimiter, auth.verifyOtpLogin);
router.post('/forgot-password', otpSendLimiter, auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);
router.get('/me', protect, auth.getMe);
router.post('/logout', protect, auth.logout);

export default router;
