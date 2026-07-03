import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Provider from '../models/Provider.js';
import ProviderProfile from '../models/ProviderProfile.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { signAccessToken, signRefreshToken } from '../utils/generateToken.js';
import { generateOTP, saveOTP, verifyOTP } from '../services/otpService.js';
import { sendSmsOtp } from '../services/smsService.js';
import { sendEmailOtp as sendEmailOtpService, sendPasswordResetEmail } from '../services/emailService.js';
import { normalizeIndianPhone } from '../utils/phone.js';

const sendTokens = (user, res) => {
  const payload = { id: user._id, role: user.role };
  const token = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.json({
    success: true,
    token,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      city: user.city,
    },
  });
};

export const register = catchAsync(async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  const normalizedPhone = normalizeIndianPhone(phone);
  if (!normalizedPhone) throw new AppError('Invalid phone number', 400);

  if (await User.findOne({ $or: [{ email }, { phone: normalizedPhone }] })) {
    throw new AppError('Email or phone already registered', 400);
  }
  const allowedRoles = ['customer', 'provider', 'worker', 'employer'];
  const selectedRole = allowedRoles.includes(role) ? role : 'customer';

  const referralCode = `SD${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const user = await User.create({
    name,
    email,
    phone: normalizedPhone,
    password,
    role: selectedRole,
    referralCode,
  });
  await Wallet.create({ user: user._id });

  // Auto-create provider records for provider registrations
  if (selectedRole === 'provider') {
    await Provider.create({
      user: user._id,
      verificationStatus: 'pending',
      city: '',
    });
    await ProviderProfile.create({
      user: user._id,
      overallStatus: 'incomplete',
    });
  }

  return sendTokens(user, res);
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  return sendTokens(user, res);
});

export const sendOtp = catchAsync(async (req, res) => {
  const normalizedPhone = normalizeIndianPhone(req.body.phone);
  if (!normalizedPhone) throw new AppError('Enter valid 10-digit Indian mobile number', 400);

  let user = await User.findOne({ phone: normalizedPhone });
  if (!user) {
    user = await User.create({
      name: 'User',
      email: `${normalizedPhone}@servdeal.temp`,
      phone: normalizedPhone,
      password: Math.random().toString(36),
    });
    await Wallet.create({ user: user._id });
  }

  const otp = generateOTP();
  await saveOTP(user._id, otp);

  let smsSent = false;
  try {
    await sendSmsOtp(normalizedPhone, otp);
    smsSent = true;
  } catch (err) {
    console.error('[OTP SMS]', err.message);
    if (process.env.NODE_ENV === 'production' && process.env.OTP_EXPOSE_IN_RESPONSE !== 'true') {
      throw new AppError('Could not send SMS. Check SMS_PROVIDER settings.', 503);
    }
  }

  res.json({
    success: true,
    message: smsSent ? 'OTP sent to your mobile' : 'OTP generated (SMS not configured)',
    phone: normalizedPhone,
  });
});

export const verifyOtpLogin = catchAsync(async (req, res) => {
  const normalizedPhone = normalizeIndianPhone(req.body.phone);
  if (!normalizedPhone) throw new AppError('Invalid phone number', 400);

  const user = await User.findOne({ phone: normalizedPhone }).select('+otp +otpExpires');
  if (!user) throw new AppError('User not found', 404);

  const valid = await verifyOTP(user, req.body.otp);
  if (!valid) throw new AppError('Invalid or expired OTP', 400);
  return sendTokens(user, res);
});

// =========================================
// Email OTP Authentication
// =========================================

export const sendEmailOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError('Valid email is required', 400);
  }

  let user = await User.findOne({ email });
  if (!user) {
    return res.json({
      success: true,
      message: 'If an account exists with this email, an OTP has been sent.',
      email,
    });
  }

  const otp = generateOTP();
  await saveOTP(user._id, otp);

  let emailSent = false;
  try {
    await sendEmailOtpService(email, user.name, otp);
    emailSent = true;
  } catch (err) {
    console.error('[Email OTP]', err.message);
  }

  res.json({
    success: true,
    message: emailSent ? 'OTP sent to your email' : 'OTP generated (email not configured)',
    email,
  });
});

export const verifyEmailOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }).select('+otp +otpExpires');
  if (!user) throw new AppError('User not found', 404);

  const valid = await verifyOTP(user, otp);
  if (!valid) throw new AppError('Invalid or expired OTP', 400);
  return sendTokens(user, res);
});

export const resendEmailOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new AppError('User not found', 404);

  const otp = generateOTP();
  await saveOTP(user._id, otp);

  let emailSent = false;
  try {
    await sendEmailOtpService(email, user.name, otp);
    emailSent = true;
  } catch (err) {
    console.error('[Resend Email OTP]', err.message);
  }

  const exposeOtp =
    !emailSent &&
    (process.env.NODE_ENV === 'development' || process.env.OTP_EXPOSE_IN_RESPONSE === 'true');

  res.json({
    success: true,
    message: emailSent ? 'New OTP sent to your email' : 'OTP regenerated (email not configured)',
    ...(exposeOtp && { otp }),
  });
});

// =========================================
// Forgot Password (via Email)
// =========================================

export const forgotPassword = catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (user) {
    const otp = generateOTP();
    await saveOTP(user._id, otp);

    let emailSent = false;
    try {
      await sendPasswordResetEmail(user.email, user.name, otp);
      emailSent = true;
    } catch (err) {
      console.error('[Forgot Password Email]', err.message);
    }
  }

  res.json({
    success: true,
    message: 'If an account exists with that email, a password reset OTP has been sent.',
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { email, otp, password } = req.body;
  const user = await User.findOne({ email }).select('+password +otp +otpExpires');
  if (!user) throw new AppError('User not found', 404);
  const valid = await verifyOTP(user, otp);
  if (!valid) throw new AppError('Invalid OTP', 400);
  user.password = password;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
});

export const getMe = catchAsync(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const logout = catchAsync(async (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', { secure: isProd, sameSite: isProd ? 'none' : 'lax' });
  res.json({ success: true, message: 'Logged out' });
});
