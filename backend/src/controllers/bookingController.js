import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Provider from '../models/Provider.js';
import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import { calculateCommission } from '../services/paymentService.js';
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

  const amount = req.body.amount || service.basePrice;
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
    scheduledAt: req.body.scheduledAt,
    address: req.body.address,
    amount,
    gst: req.body.gst || 0,
    discount: req.body.discount || 0,
    commission,
    providerEarning,
    paymentMethod,
    paymentStatus,
    status,
    notes: req.body.notes,
    timeline: [{ status, note: 'Booking created' }],
  });

  await Notification.create({
    user: req.user._id,
    title: 'Booking Created',
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
  if (status === 'completed') booking.paymentStatus = 'paid';
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
