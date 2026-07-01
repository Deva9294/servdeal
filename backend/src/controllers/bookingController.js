import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Provider from '../models/Provider.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import { buildPayuPayload, isPayuConfigured } from '../services/paymentService.js';

const pushTimeline = (booking, status, note) => {
  booking.timeline.push({ status, note });
};

const createPayuOrderForBooking = async (booking, user) => {
  const payAmount = booking.estimatedAmount || 0;
  if (!payAmount || payAmount < 1) throw new AppError('Invalid booking amount', 400);
  if (!isPayuConfigured()) throw new AppError('PayU is not configured', 503);

  const gatewayOrderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const payment = await Payment.create({
    booking: booking._id,
    user: user._id,
    amount: payAmount,
    gateway: 'payu',
    gatewayOrderId,
    status: 'created',
    invoiceNumber: `INV-${Date.now()}`,
    metadata: { purpose: 'booking', bookingId: String(booking._id) },
  });

  const payu = buildPayuPayload({
    amount: payAmount,
    txnid: gatewayOrderId,
    productinfo: `Booking ${booking.bookingId}`,
    firstname: user.name || 'Customer',
    email: user.email || '',
    phone: user.phone || '',
    purpose: 'booking',
    bookingId: String(booking._id),
    paymentId: String(payment._id),
  });

  booking.payuPaymentLink = payu.action || '';
  await booking.save();

  return { payment, payu };
};

export const createBooking = catchAsync(async (req, res) => {
  const {
    serviceId,
    providerId,
    scheduledAt,
    timeSlot,
    time,
    address,
    customerNotes,
    estimatedAmount,
    amount,
    paymentMethod = 'payu',
  } = req.body;

  if (!providerId) throw new AppError('Select a nearby available provider.', 400);
  if (!scheduledAt) throw new AppError('Date and time are required.', 400);
  if (!address?.line1) throw new AppError('Service address is required.', 400);
  if (address.lat == null || address.lng == null) {
    throw new AppError('Enable live location to book a service.', 400);
  }

  let service;
  if (mongoose.Types.ObjectId.isValid(serviceId)) {
    service = await Service.findById(serviceId);
  } else {
    service = await Service.findOne({ slug: serviceId });
  }
  if (!service) throw new AppError('Service not found', 404);

  const provider = await Provider.findById(providerId);
  if (!provider) throw new AppError('Provider not found', 404);
  if (provider.verificationStatus !== 'verified') {
    throw new AppError('Selected provider is not verified.', 400);
  }
  if (!provider.isOnline) {
    throw new AppError('Selected provider is currently offline.', 400);
  }

  const slot = timeSlot || time || '';
  const payAmount = Number(estimatedAmount || amount || service.basePrice || 0);
  if (payAmount <= 0) throw new AppError('Invalid service amount.', 400);

  const scheduleDate = new Date(scheduledAt);
  const dayStart = new Date(scheduleDate);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(scheduleDate);
  dayEnd.setHours(23, 59, 59, 999);

  const existing = await Booking.findOne({
    provider: provider._id,
    scheduledAt: { $gte: dayStart, $lte: dayEnd },
    timeSlot: slot,
    status: { $nin: ['cancelled'] },
  });
  if (existing) {
    throw new AppError('Provider is already booked for this date and time.', 409);
  }

  const booking = await Booking.create({
    customer: req.user._id,
    service: service._id,
    category: service.name,
    provider: provider._id,
    scheduledAt: scheduleDate,
    timeSlot: slot,
    address,
    customerNotes: customerNotes || '',
    estimatedAmount: payAmount,
    paymentMethod,
    status: 'pending',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    timeline: [{ status: 'pending', note: 'Booking request sent to provider' }],
  });

  const io = req.app.get('io');
  io?.to(`user:${provider.user}`).emit('booking:new', { bookingId: booking._id });
  await Notification.create({
    user: provider.user,
    title: 'New Booking Request',
    message: `New booking ${booking.bookingId} for ${service.name}`,
    type: 'booking',
  });

  if (paymentMethod === 'payu') {
    const { payu } = await createPayuOrderForBooking(booking, req.user);
    return res.status(201).json({
      success: true,
      data: booking,
      requiresPayment: true,
      payu,
    });
  }

  res.status(201).json({ success: true, data: booking, requiresPayment: false });
});

export const getMyBookings = catchAsync(async (req, res) => {
  const filter = { customer: req.user._id };
  if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;

  const bookings = await Booking.find(filter)
    .populate('service', 'name slug icon')
    .populate({ path: 'provider', select: 'fullName shopName profilePicture phone' })
    .sort('-createdAt');
  res.json({ success: true, data: bookings });
});

export const getBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('service')
    .populate({ path: 'provider', select: 'fullName shopName profilePicture phone currentLocation' })
    .populate('customer', 'name phone');
  if (!booking) throw new AppError('Booking not found', 404);

  const isCustomer = String(booking.customer._id || booking.customer) === String(req.user._id);
  const provider = await Provider.findOne({ user: req.user._id });
  const isProvider = provider && String(booking.provider?._id || booking.provider) === String(provider._id);
  const isAdmin = ['admin', 'superadmin'].includes(req.user.role);

  if (!isCustomer && !isProvider && !isAdmin) {
    throw new AppError('Not authorized', 403);
  }

  res.json({ success: true, data: booking });
});

export const getBookingTracking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate({ path: 'provider', select: 'fullName shopName currentLocation profilePicture phone' });
  if (!booking) throw new AppError('Booking not found', 404);

  const isCustomer = String(booking.customer) === String(req.user._id);
  if (!isCustomer && !['admin', 'superadmin'].includes(req.user.role)) {
    throw new AppError('Not authorized', 403);
  }

  if (!['upcoming', 'in_progress'].includes(booking.status)) {
    throw new AppError('Live tracking is available only when provider is assigned or en route.', 400);
  }

  res.json({
    success: true,
    data: {
      bookingId: booking.bookingId,
      status: booking.status,
      providerLocation: booking.providerLocation,
      address: booking.address,
      provider: booking.provider,
      etaMinutes: booking.etaMinutes,
    },
  });
});

export const getProviderBookings = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider profile not found', 404);

  const filter = { provider: provider._id };
  if (req.query.status) filter.status = req.query.status;

  const bookings = await Booking.find(filter)
    .populate('service', 'name slug icon')
    .populate('customer', 'name phone avatar')
    .sort('-scheduledAt');

  res.json({ success: true, data: bookings });
});

export const acceptBooking = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const booking = await Booking.findOne({ _id: req.params.id, provider: provider._id });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'pending') throw new AppError('Booking already responded', 400);
  if (booking.paymentMethod === 'payu' && booking.paymentStatus !== 'paid') {
    throw new AppError('Customer payment pending. Cannot accept yet.', 400);
  }

  booking.status = 'upcoming';
  pushTimeline(booking, 'upcoming', 'Provider accepted the booking');
  await booking.save();

  const io = req.app.get('io');
  io?.to(`user:${booking.customer}`).emit('booking:accepted', { bookingId: booking._id });
  await Notification.create({
    user: booking.customer,
    title: 'Booking Accepted',
    message: `Your booking ${booking.bookingId} has been accepted.`,
    type: 'booking',
  });

  res.json({ success: true, data: booking });
});

export const rejectBooking = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const booking = await Booking.findOne({ _id: req.params.id, provider: provider._id });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'pending') throw new AppError('Booking already responded', 400);

  booking.status = 'cancelled';
  pushTimeline(booking, 'cancelled', 'Provider declined the booking');
  await booking.save();

  const io = req.app.get('io');
  io?.to(`user:${booking.customer}`).emit('booking:rejected', { bookingId: booking._id });

  res.json({ success: true, data: booking });
});

export const startJob = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const booking = await Booking.findOne({ _id: req.params.id, provider: provider._id });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'upcoming') throw new AppError('Booking not ready to start', 400);

  const { lat, lng } = req.body;
  booking.status = 'in_progress';
  if (lat != null && lng != null) {
    booking.providerLocation = { lat, lng, updatedAt: new Date() };
  }
  pushTimeline(booking, 'in_progress', 'Provider started and is on the way');
  await booking.save();

  const io = req.app.get('io');
  io?.to(`user:${booking.customer}`).emit('booking:started', { bookingId: booking._id });

  res.json({ success: true, data: booking });
});

export const updateJobLocation = catchAsync(async (req, res) => {
  const { lat, lng } = req.body;
  if (lat == null || lng == null) throw new AppError('lat and lng are required', 400);

  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const booking = await Booking.findOne({ _id: req.params.id, provider: provider._id, status: 'in_progress' });
  if (!booking) throw new AppError('Active booking not found', 404);

  booking.providerLocation = { lat, lng, updatedAt: new Date() };
  await provider.updateOne({
    currentLocation: { type: 'Point', coordinates: [lng, lat] },
    locationUpdatedAt: new Date(),
  });
  await booking.save();

  const io = req.app.get('io');
  io?.to(`user:${booking.customer}`).emit('booking:location', {
    bookingId: booking._id,
    lat,
    lng,
    updatedAt: booking.providerLocation.updatedAt,
  });

  res.json({ success: true, data: booking.providerLocation });
});

export const completeJob = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const booking = await Booking.findOne({ _id: req.params.id, provider: provider._id });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'in_progress') throw new AppError('Job not in progress', 400);

  booking.status = 'completed';
  booking.finalAmount = booking.estimatedAmount;
  pushTimeline(booking, 'completed', 'Service completed successfully');
  await booking.save();

  provider.completedJobs += 1;
  await provider.save();

  const io = req.app.get('io');
  io?.to(`user:${booking.customer}`).emit('booking:completed', { bookingId: booking._id });

  res.json({ success: true, data: booking });
});

export const getAllBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find()
    .populate('service', 'name')
    .populate('customer', 'name')
    .populate({ path: 'provider', select: 'fullName shopName' })
    .sort('-createdAt')
    .limit(100);
  res.json({ success: true, data: bookings });
});
