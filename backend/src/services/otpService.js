import User from '../models/User.js';

export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const saveOTP = async (userId, otp) => {
  const expires = new Date(Date.now() + (process.env.OTP_EXPIRE_MINUTES || 10) * 60 * 1000);
  await User.findByIdAndUpdate(userId, { otp, otpExpires: expires });
  return otp;
};

export const verifyOTP = async (user, otp) => {
  if (!user.otp || !user.otpExpires) return false;
  if (user.otpExpires < new Date()) return false;
  if (user.otp !== otp) return false;
  user.otp = undefined;
  user.otpExpires = undefined;
  user.isVerified = true;
  await user.save();
  return true;
};
