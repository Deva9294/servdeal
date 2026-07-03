import User from '../models/User.js';
import BookingOTP from '../models/BookingOTP.js';
import { randomInt } from 'crypto';

export const generateOTP = () =>
  randomInt(100000, 999999).toString();

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

export const generateBookingStartOTP = async (bookingId) => {
  const otp = generateOTP();
  const expires = new Date(Date.now() + 30 * 60 * 1000);
  await BookingOTP.findOneAndUpdate(
    { booking: bookingId },
    { booking: bookingId, startOTP: otp, startOTPExpires: expires, startOTPVerified: false },
    { upsert: true, new: true }
  );
  return otp;
};

export const verifyBookingStartOTP = async (bookingId, otp) => {
  const record = await BookingOTP.findOne({ booking: bookingId });
  if (!record || !record.startOTP || record.startOTPExpires < new Date()) return false;
  if (record.startOTP !== otp) return false;
  record.startOTPVerified = true;
  record.startOTPVerifiedAt = new Date();
  await record.save();
  return true;
};

export const generateBookingCompleteOTP = async (bookingId) => {
  const otp = generateOTP();
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  await BookingOTP.findOneAndUpdate(
    { booking: bookingId },
    { completeOTP: otp, completeOTPExpires: expires, completeOTPVerified: false },
    { upsert: true, new: true }
  );
  return otp;
};

export const verifyBookingCompleteOTP = async (bookingId, otp) => {
  const record = await BookingOTP.findOne({ booking: bookingId });
  if (!record || !record.completeOTP || record.completeOTPExpires < new Date()) return false;
  if (record.completeOTP !== otp) return false;
  record.completeOTPVerified = true;
  record.completeOTPVerifiedAt = new Date();
  await record.save();
  return true;
};
