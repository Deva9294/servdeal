import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Provider from '../models/Provider.js';
import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import { calculateCommission } from '../services/paymentService.js';
import { calculateDynamicPrice } from '../services/pricingService.js';
import { autoAssignBooking, acceptBookingOffer, rejectBookingOffer } from '../services/assignmentService.js';
import { detectFakeBooking } from '../services/trustService.js';
import { generateBookingStartOTP, verifyBookingStartOTP, generateBookingCompleteOTP, verifyBookingCompleteOTP } from '../services/otpService.js';
import { updateProviderStats } from '../services/rankingService.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';

export const createBooking = catchAsync(async (req, res) => {
  let service;
  if (mongoose.Types.ObjectId.isValid(req.body.serviceId)) {
    service = await Service.findById(req.body.serviceId);
  } else {
    service = await Service.findOne({ slug: req.body.serviceId });
  }
  if (!service) throw new AppError('Service not found', 404);

  let amount = req.body.amount || service.basePrice;
  let baseAmount = amount;
  let surgeMultiplier = 1;
  let dynamicPricingApplied = false;

  if (req.body.address?.lat && req.body.address?.lng && req.body.useDynamicPricing !== false) {
    try {
      const pricing = await calculateDynamicPrice({
        serviceId: service._id,
        city: req.body.address?.city,
        customerLat: req.body.address.lat,
        customerLng: req.body.address.lng,
        basePrice: amount,
        isEmergency: req.body.isEmergency || false,
      });
      amount = pricing.finalAmount;
      baseAmount = pricing.basePrice;
      surgeMultiplier = pricing.surgeMultiplier;
      dynamicPricingApplied = true;
    } catch (err) {
      console.error('Dynamic pricing error:', err.message);
    }
  }

  const { commission, providerEarning } = calculateCommission(amount);

  const paymentMethod = req.body.paymentMethod || 'payu';
  let paymentStatus = 'pending';
  let status = 'pending';

  if (paymentMethod === 'wallet') {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) wallet = await Wallet.create({ user: req.user._id });
    if (wallet.balance < amount) throw new AppError('Insufficient wallet balance', 400);
    wallet.balance -= amount;
    wallet.transactions.push({
      type: 'debit',
      amount,
      description: `Booking ${service.name}`,
    });
    await wallet.save();
    await User.findByIdAndUpdate(req.user._id, { walletBalance: wallet.balance });
    paymentStatus = 'paid';
    status = 'confirmed';
  } else if (paymentMethod === 'cod') {
    paymentStatus = 'pending';
    status = 'pending';
  }

  const booking = await Booking.create({
    customer: req.user._id,
    service: service._id,
    packageName: req.body.packageName,
    scheduledAt: req.body.scheduledAt || new Date(),
    address: req.body.address,
    amount,
    baseAmount,
    surgeMultiplier,
    dynamicPricingApplied,
    gst: req.body.gst || 0,
    discount: req.body.discount || 0,
    commission,
    providerEarning,
    paymentMethod,
    paymentStatus,
    status,
    isEmergency: req.body.isEmergency || false,
    assignmentRadiusKm: req.body.radius || 20,
    notes: req.body.notes,
    timeline: [{ status, note: 'Booking created' }],
  });

  await detectFakeBooking(booking);

  const io = req.app.get('io');
  if (req.body.providerId) {
    // Direct booking with specific provider
    const provider = await Provider.findById(req.body.providerId);
    if (provider && provider.verificationStatus === 'approved') {
      booking.provider = provider._id;
      booking.status = 'confirmed';
      booking.timeline.push({ status: 'confirmed', note: 'Direct provider booking' });
      await booking.save();

      await Notification.create({
        user: provider.user,
        title: 'New Direct Booking',
        message: `You have a new booking ${booking.bookingId} for ${service.name}`,
        type: 'booking',
        link: `/provider/bookings`,
      });

      io?.to(`user:${provider.user}`).emit('booking:assigned', {
        bookingId: booking._id,
        message: 'New direct booking assigned',
      });
    }
  } else if (req.body.autoAssign !== false) {
    await autoAssignBooking(booking._id, io);
  }

  await Notification.create({
    user: req.user._id,
    title: req.body.isEmergency ? 'Emergency Booking Created' : 'Booking Created',
    message: `Your booking ${booking.bookingId} has been placed.`,
    type: 'booking',
    link: `/dashboard/bookings/${booking._id}`,
  });

  res.status(201).json({
    success: true,
    data: booking,
    requiresPayment: ['payu', 'upi'].includes(paymentMethod),
  });
});

export const getMyBookings = catchAsync(async (req, res) => {
  const filter = { customer: req.user._id };
  if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;

  const bookings = await Booking.find(filter)
    .populate('service')
    .populate({ path: 'provider', populate: { path: 'user', select: 'name phone avatar' } })
    .sort('-createdAt');

  res.json({ success: true, data: bookings });
});

export const getBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('service')
    .populate({ path: 'provider', populate: 'user' })
    .populate('customer', 'name phone');
  if (!booking) throw new AppError('Booking not found', 404);
  res.json({ success: true, data: booking });
});

export const updateBookingStatus = catchAsync(async (req, res) => {
  const { status, note } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);

  booking.status = status;
  booking.timeline.push({ status, note: note || `Status updated to ${status}` });
  if (status === 'completed') {
    booking.paymentStatus = 'paid';
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
  }
  await booking.save();

  const io = req.app.get('io');
  if (io) {
    io.to(`booking:${booking._id}`).emit('booking:update', booking);
    io.to(`user:${booking.customer}`).emit('notification', {
      title: 'Booking Update',
      message: `Booking ${booking.bookingId} is now ${status}`,
    });
  }

  res.json({ success: true, data: booking });
});

export const assignProvider = catchAsync(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { provider: req.body.providerId, status: 'confirmed' },
    { new: true }
  );
  booking.timeline.push({ status: 'confirmed', note: 'Provider assigned' });
  await booking.save();
  res.json({ success: true, data: booking });
});

export const getProviderBookings = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider profile not found', 404);

  const filter = { provider: provider._id };
  if (req.query.status) filter.status = req.query.status;

  const bookings = await Booking.find(filter)
    .populate('service')
    .populate('customer', 'name phone avatar')
    .sort('-scheduledAt');

  res.json({ success: true, data: bookings });
});

export const updateProviderLocation = catchAsync(async (req, res) => {
  const { lat, lng, bookingId } = req.body;
  const provider = await Provider.findOneAndUpdate(
    { user: req.user._id },
    { currentLocation: { type: 'Point', coordinates: [lng, lat] } },
    { new: true }
  );

  if (bookingId) {
    await Booking.findByIdAndUpdate(bookingId, {
      providerLocation: { lat, lng, updatedAt: new Date() },
    });
    const io = req.app.get('io');
    io?.to(`booking:${bookingId}`).emit('location:update', { lat, lng });
  }

  res.json({ success: true, data: provider });
});

export const getAllBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find()
    .populate('service')
    .populate('customer', 'name')
    .populate({ path: 'provider', populate: { path: 'user', select: 'name' } })
    .sort('-createdAt')
    .limit(50);
  res.json({ success: true, data: bookings });
});

// Provider accepts a booking manually
export const acceptBooking = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const io = req.app.get('io');
  const result = await acceptBookingOffer(req.params.id, provider._id, io);
  if (!result.success) throw new AppError(result.message, 400);
  res.json(result);
});

// Provider rejects a booking
export const rejectBooking = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const result = await rejectBookingOffer(req.params.id, provider._id);
  res.json(result);
});

// Provider starts job (generates OTP sent to customer)
export const startBooking = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'confirmed') throw new AppError('Booking not confirmed yet', 400);
  if (String(booking.provider) !== String(provider._id)) throw new AppError('Not assigned to you', 403);

  const otp = await generateBookingStartOTP(booking._id);

  await Notification.create({
    user: booking.customer,
    title: 'Job Start OTP',
    message: `Your OTP to start the job is ${otp}. Share it with your provider.`,
    type: 'otp',
  });

  res.json({ success: true, message: 'Start OTP generated', data: { otp } });
});

// Provider completes job (requires customer OTP)
export const completeBooking = catchAsync(async (req, res) => {
  const { otp } = req.body;
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);
  if (String(booking.provider) !== String(provider._id)) throw new AppError('Not assigned to you', 403);

  const valid = await verifyBookingCompleteOTP(req.params.id, otp);
  if (!valid) throw new AppError('Invalid or expired OTP', 400);

  booking.status = 'completed';
  booking.paymentStatus = 'paid';
  booking.otpVerifiedComplete = true;
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
  await Notification.create({
    user: booking.customer,
    title: 'Job Completed',
    message: `Your booking ${booking.bookingId} has been completed`,
    type: 'booking',
  });

  res.json({ success: true, message: 'Job completed successfully', data: booking });
});
