import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Provider from '../models/Provider.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import UserSubscription from '../models/UserSubscription.js';
import Withdrawal from '../models/Withdrawal.js';
import DynamicPricing from '../models/DynamicPricing.js';
import TrustReport from '../models/TrustReport.js';
import Review from '../models/Review.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import { findRankedProviders, updateProviderStats } from '../services/rankingService.js';
import { autoAssignBooking, acceptBookingOffer, rejectBookingOffer } from '../services/assignmentService.js';
import { calculateDynamicPrice } from '../services/pricingService.js';
import { generateBookingStartOTP, verifyBookingStartOTP, generateBookingCompleteOTP, verifyBookingCompleteOTP } from '../services/otpService.js';
import { detectFakeReview, detectFakeBooking, detectDuplicateAccount } from '../services/trustService.js';
import { getAdminAnalytics, getProviderAnalytics, getCustomerAnalytics } from '../services/analyticsService.js';
import { sendPushNotification, notifyCustomerBooking } from '../services/pushNotificationService.js';
import { calculateCommission } from '../services/paymentService.js';

// ========== SMART RANKING ==========
export const getRankedProviders = catchAsync(async (req, res) => {
  const { serviceId, lat, lng, radius = 20 } = req.query;
  if (!serviceId || !lat || !lng) throw new AppError('serviceId, lat, and lng are required', 400);

  const ranked = await findRankedProviders({
    serviceId,
    customerLat: parseFloat(lat),
    customerLng: parseFloat(lng),
    radiusKm: parseInt(radius),
    limit: 20,
  });

  res.json({ success: true, data: ranked });
});

// ========== AUTO ASSIGNMENT ==========
export const triggerAutoAssign = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.provider) throw new AppError('Already assigned', 400);

  const io = req.app.get('io');
  const ranked = await autoAssignBooking(booking._id, io);
  res.json({ success: true, message: 'Auto-assignment triggered', data: ranked });
});

export const providerAcceptBooking = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const io = req.app.get('io');
  const result = await acceptBookingOffer(req.params.id, provider._id, io);
  if (!result.success) throw new AppError(result.message, 400);
  res.json(result);
});

export const providerRejectBooking = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const result = await rejectBookingOffer(req.params.id, provider._id);
  res.json(result);
});

// ========== EMERGENCY BOOKING ==========
export const createEmergencyBooking = catchAsync(async (req, res) => {
  const service = await Service.findById(req.body.serviceId);
  if (!service) throw new AppError('Service not found', 404);

  const amount = req.body.amount || service.basePrice;
  const { commission, providerEarning } = calculateCommission(amount);

  const booking = await Booking.create({
    customer: req.user._id,
    service: service._id,
    scheduledAt: new Date(Date.now() + 15 * 60 * 1000),
    address: req.body.address,
    amount,
    commission,
    providerEarning,
    paymentMethod: req.body.paymentMethod || 'cod',
    status: 'pending',
    isEmergency: true,
    assignmentRadiusKm: req.body.radius || 10,
    notes: req.body.notes || 'Emergency booking',
    timeline: [{ status: 'pending', note: 'Emergency booking created' }],
  });

  const io = req.app.get('io');
  await autoAssignBooking(booking._id, io);

  await Notification.create({
    user: req.user._id,
    title: 'Emergency Booking Placed',
    message: `We are finding the nearest provider for ${service.name}`,
    type: 'booking',
  });

  res.status(201).json({ success: true, data: booking });
});

// ========== DYNAMIC PRICING ==========
export const getDynamicPrice = catchAsync(async (req, res) => {
  const { serviceId, lat, lng, basePrice, isEmergency } = req.body;
  if (!serviceId || !lat || !lng || !basePrice) throw new AppError('Missing required fields', 400);

  const price = await calculateDynamicPrice({
    serviceId,
    customerLat: parseFloat(lat),
    customerLng: parseFloat(lng),
    basePrice: parseFloat(basePrice),
    isEmergency: isEmergency === true,
  });

  res.json({ success: true, data: price });
});

export const createPricingRule = catchAsync(async (req, res) => {
  const rule = await DynamicPricing.create(req.body);
  res.status(201).json({ success: true, data: rule });
});

export const getPricingRules = catchAsync(async (req, res) => {
  const rules = await DynamicPricing.find().populate('service', 'name').sort('-createdAt');
  res.json({ success: true, data: rules });
});

// ========== OTP SECURITY ==========
export const generateStartOTP = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'confirmed') throw new AppError('Booking not confirmed yet', 400);

  const otp = await generateBookingStartOTP(booking._id);

  await Notification.create({
    user: booking.customer,
    title: 'Job Start OTP',
    message: `Your OTP to start the job is ${otp}. Share it with your provider.`,
    type: 'otp',
  });

  res.json({ success: true, message: 'Start OTP generated', data: { otp } });
});

export const verifyStartOTP = catchAsync(async (req, res) => {
  const { otp } = req.body;
  const valid = await verifyBookingStartOTP(req.params.id, otp);
  if (!valid) throw new AppError('Invalid or expired OTP', 400);

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: 'ongoing', otpVerifiedStart: true },
    { new: true }
  );
  booking.timeline.push({ status: 'ongoing', note: 'Job started after OTP verification' });
  await booking.save();

  const io = req.app.get('io');
  io?.to(`booking:${booking._id}`).emit('booking:started', booking);

  res.json({ success: true, message: 'Job started successfully', data: booking });
});

export const generateCompleteOTP = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'ongoing') throw new AppError('Job not ongoing', 400);

  const otp = await generateBookingCompleteOTP(booking._id);

  await Notification.create({
    user: booking.customer,
    title: 'Job Completion OTP',
    message: `Your OTP to complete the job is ${otp}. Share it with your provider.`,
    type: 'otp',
  });

  res.json({ success: true, message: 'Complete OTP generated', data: { otp } });
});

export const verifyCompleteOTP = catchAsync(async (req, res) => {
  const { otp } = req.body;
  const valid = await verifyBookingCompleteOTP(req.params.id, otp);
  if (!valid) throw new AppError('Invalid or expired OTP', 400);

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: 'completed', otpVerifiedComplete: true, paymentStatus: 'paid' },
    { new: true }
  );
  booking.timeline.push({ status: 'completed', note: 'Job completed after OTP verification' });
  await booking.save();

  await updateProviderStats(booking.provider);

  // Credit provider wallet on job completion (all payment methods)
  if (booking.provider) {
    const providerDoc = await Provider.findById(booking.provider);
    const providerUserId = providerDoc ? providerDoc.user : booking.provider;
    let wallet = await Wallet.findOne({ user: providerUserId });
    if (!wallet) wallet = await Wallet.create({ user: providerUserId, role: 'provider' });
    wallet.balance += booking.providerEarning;
    wallet.totalEarnings += booking.providerEarning;
    wallet.transactions.push({
      type: 'credit',
      amount: booking.providerEarning,
      description: `Earning for booking ${booking.bookingId}`,
      booking: booking._id,
    });
    await wallet.save();
  }

  const io = req.app.get('io');
  io?.to(`booking:${booking._id}`).emit('booking:completed', booking);
  await notifyCustomerBooking(booking.customer, 'Job Completed', `Your booking ${booking.bookingId} has been completed`, booking, io);

  res.json({ success: true, message: 'Job completed successfully', data: booking });
});

// ========== SUBSCRIPTION PLANS ==========
export const getSubscriptionPlans = catchAsync(async (req, res) => {
  const plans = await SubscriptionPlan.find({ targetRole: req.query.role || 'provider', isActive: true }).sort('displayOrder');
  res.json({ success: true, data: plans });
});

export const createSubscriptionPlan = catchAsync(async (req, res) => {
  const plan = await SubscriptionPlan.create(req.body);
  res.status(201).json({ success: true, data: plan });
});

export const subscribeToPlan = catchAsync(async (req, res) => {
  const plan = await SubscriptionPlan.findById(req.body.planId);
  if (!plan) throw new AppError('Plan not found', 404);

  const endDate = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);
  const subscription = await UserSubscription.create({
    user: req.user._id,
    plan: plan._id,
    endDate,
    status: 'active',
  });

  if (req.user.role === 'provider') {
    const provider = await Provider.findOneAndUpdate(
      { user: req.user._id },
      { subscriptionStatus: 'active', subscriptionExpiresAt: endDate },
      { new: true }
    );
    if (provider) {
      provider.isFeatured = plan.benefits?.featuredProfile || false;
      await provider.save();
    }
  }

  res.status(201).json({ success: true, data: subscription });
});

export const getMySubscription = catchAsync(async (req, res) => {
  const subscription = await UserSubscription.findOne({ user: req.user._id, status: 'active' })
    .populate('plan')
    .sort('-createdAt');
  res.json({ success: true, data: subscription });
});

// ========== WORKER WALLET & WITHDRAWALS ==========
export const getWorkerWallet = catchAsync(async (req, res) => {
  let wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) wallet = await Wallet.create({ user: req.user._id, role: req.user.role });
  res.json({ success: true, data: wallet });
});

export const requestWithdrawal = catchAsync(async (req, res) => {
  const { amount, method } = req.body;
  if (!amount || amount < 100) throw new AppError('Minimum withdrawal is 100', 400);

  let wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet || wallet.balance < amount) throw new AppError('Insufficient balance', 400);

  const provider = await Provider.findOne({ user: req.user._id });

  const withdrawal = await Withdrawal.create({
    user: req.user._id,
    provider: provider?._id,
    amount,
    method,
    bankDetails: provider?.bankDetails || req.body.bankDetails,
  });

  wallet.balance -= amount;
  wallet.pendingBalance += amount;
  wallet.transactions.push({
    type: 'withdrawal',
    amount,
    status: 'pending',
    description: 'Withdrawal request',
    withdrawal: withdrawal._id,
  });
  await wallet.save();

  res.status(201).json({ success: true, data: withdrawal });
});

export const getWithdrawals = catchAsync(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const withdrawals = await Withdrawal.find(filter).sort('-createdAt');
  res.json({ success: true, data: withdrawals });
});

export const updateWithdrawalStatus = catchAsync(async (req, res) => {
  const { status, rejectionReason, transactionRef } = req.body;
  const withdrawal = await Withdrawal.findById(req.params.id);
  if (!withdrawal) throw new AppError('Withdrawal not found', 404);

  withdrawal.status = status;
  if (rejectionReason) withdrawal.rejectionReason = rejectionReason;
  if (transactionRef) withdrawal.transactionRef = transactionRef;
  withdrawal.processedAt = new Date();
  withdrawal.processedBy = req.user._id;
  await withdrawal.save();

  const wallet = await Wallet.findOne({ user: withdrawal.user });
  if (wallet) {
    wallet.pendingBalance -= withdrawal.amount;
    if (status === 'approved' || status === 'processed') {
      wallet.totalWithdrawn += withdrawal.amount;
      wallet.transactions.push({
        type: 'withdrawal',
        amount: withdrawal.amount,
        status: 'completed',
        description: 'Withdrawal processed',
        withdrawal: withdrawal._id,
      });
    } else if (status === 'rejected') {
      wallet.balance += withdrawal.amount;
      wallet.transactions.push({
        type: 'withdrawal',
        amount: withdrawal.amount,
        status: 'failed',
        description: `Withdrawal rejected: ${rejectionReason}`,
        withdrawal: withdrawal._id,
      });
    }
    await wallet.save();
  }

  res.json({ success: true, data: withdrawal });
});

// ========== TRUST & SAFETY ==========
export const runTrustCheck = catchAsync(async (req, res) => {
  const { type, targetId } = req.body;

  let result;
  if (type === 'review') {
    const review = await Review.findById(targetId);
    if (!review) throw new AppError('Review not found', 404);
    result = await detectFakeReview(review);
  } else if (type === 'booking') {
    const booking = await Booking.findById(targetId);
    if (!booking) throw new AppError('Booking not found', 404);
    result = await detectFakeBooking(booking);
  } else if (type === 'user') {
    const user = await User.findById(targetId);
    if (!user) throw new AppError('User not found', 404);
    result = await detectDuplicateAccount(user);
  } else {
    throw new AppError('Invalid trust check type', 400);
  }

  res.json({ success: true, data: { issues: result } });
});

export const getTrustReports = catchAsync(async (req, res) => {
  const reports = await TrustReport.find().populate('targetUser', 'name email').populate('targetProvider', 'businessName').sort('-createdAt');
  res.json({ success: true, data: reports });
});

export const updateTrustReport = catchAsync(async (req, res) => {
  const report = await TrustReport.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, reviewedBy: req.user._id, reviewedAt: new Date(), actionTaken: req.body.actionTaken },
    { new: true }
  );
  res.json({ success: true, data: report });
});

// ========== ANALYTICS ==========
export const getAnalytics = catchAsync(async (req, res) => {
  let data;
  if (req.user.role === 'admin') {
    data = await getAdminAnalytics();
  } else if (req.user.role === 'provider') {
    const provider = await Provider.findOne({ user: req.user._id });
    if (!provider) throw new AppError('Provider profile not found', 404);
    data = await getProviderAnalytics(provider._id);
  } else {
    data = await getCustomerAnalytics(req.user._id);
  }
  res.json({ success: true, data });
});

// ========== REAL-TIME TRACKING ==========
export const updateProviderLocation = catchAsync(async (req, res) => {
  const { lat, lng, bookingId } = req.body;
  const provider = await Provider.findOneAndUpdate(
    { user: req.user._id },
    { currentLocation: { type: 'Point', coordinates: [lng, lat] }, isOnline: true, lastOnlineAt: new Date() },
    { new: true }
  );

  if (bookingId) {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { providerLocation: { lat, lng, updatedAt: new Date() } },
      { new: true }
    );
    const io = req.app.get('io');
    io?.to(`booking:${bookingId}`).emit('location:update', { lat, lng, providerId: provider?._id });

    if (booking?.address?.lat && booking?.address?.lng) {
      const distance = calculateDistance(lat, lng, booking.address.lat, booking.address.lng);
      const etaMinutes = Math.max(5, Math.round(distance * 3));
      await Booking.findByIdAndUpdate(bookingId, { etaMinutes });
      io?.to(`booking:${bookingId}`).emit('eta:update', { etaMinutes, distanceKm: Math.round(distance * 100) / 100 });
    }
  }

  res.json({ success: true, data: provider });
});

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
