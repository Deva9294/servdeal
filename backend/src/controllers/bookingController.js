import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Provider from '../models/Provider.js';
import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

/* ─── Helper: push timeline ─── */
const pushTimeline = (booking, status, note) => {
  booking.timeline.push({ status, note });
};

/* ─── 1. Create Booking (Step 1: customer selects provider, date, time, notes) ─── */
export const createBooking = catchAsync(async (req, res) => {
  const { serviceId, providerId, scheduledAt, timeSlot, address, customerNotes, estimatedAmount } = req.body;

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

  // Prevent double booking
  const existing = await Booking.findOne({
    provider: provider._id,
    scheduledAt: { $gte: new Date(new Date(scheduledAt).setHours(0, 0, 0, 0)), $lt: new Date(new Date(scheduledAt).setHours(23, 59, 59, 999)) },
    timeSlot,
    status: { $nin: ['cancelled', 'paid'] },
  });
  if (existing) {
    throw new AppError('This provider is already booked for the selected date and time slot.', 409);
  }

  const booking = await Booking.create({
    customer: req.user._id,
    service: service._id,
    category: service.category || service.name,
    provider: provider._id,
    scheduledAt: scheduledAt || new Date(),
    timeSlot: timeSlot || '',
    address,
    customerNotes: customerNotes || '',
    estimatedAmount: estimatedAmount || 0,
    status: 'pending',
    paymentStatus: 'pending',
    timeline: [{ status: 'pending', note: 'Booking request sent to provider' }],
  });

  const io = req.app.get('io');
  io?.to(`user:${provider.user}`).emit('booking:new', { bookingId: booking._id });
  await Notification.create({
    user: provider.user,
    title: 'New Booking Request',
    message: `You have a new booking request ${booking.bookingId}`,
    type: 'booking',
  });

  res.status(201).json({ success: true, data: booking });
});

/* ─── 2. Customer: my bookings ─── */
export const getMyBookings = catchAsync(async (req, res) => {
  const filter = { customer: req.user._id };
  if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;

  const bookings = await Booking.find(filter)
    .populate('service', 'name slug icon')
    .populate({ path: 'provider', select: 'fullName shopName profilePicture phone' })
    .sort('-createdAt');
  res.json({ success: true, data: bookings });
});

/* ─── 3. Get single booking ─── */
export const getBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('service')
    .populate({ path: 'provider', select: 'fullName shopName profilePicture phone currentLocation' })
    .populate('customer', 'name phone');
  if (!booking) throw new AppError('Booking not found', 404);
  res.json({ success: true, data: booking });
});

/* ─── 4. Provider: list my bookings ─── */
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

/* ─── 5. Provider accepts booking ─── */
export const acceptBooking = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const booking = await Booking.findOne({ _id: req.params.id, provider: provider._id });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'pending') throw new AppError('Booking already responded', 400);

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

/* ─── 6. Provider declines booking ─── */
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
  await Notification.create({
    user: booking.customer,
    title: 'Booking Declined',
    message: `Your booking ${booking.bookingId} was declined by the provider.`,
    type: 'booking',
  });

  res.json({ success: true, data: booking });
});

/* ─── 7. Provider starts job ─── */
export const startJob = catchAsync(async (req, res) => {
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const booking = await Booking.findOne({ _id: req.params.id, provider: provider._id });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'upcoming') throw new AppError('Booking not ready to start', 400);

  booking.status = 'in_progress';
  pushTimeline(booking, 'in_progress', 'Provider started the job');
  await booking.save();

  const io = req.app.get('io');
  io?.to(`user:${booking.customer}`).emit('booking:started', { bookingId: booking._id });

  res.json({ success: true, data: booking });
});

/* ─── 8. Provider completes job + enters final amount ─── */
export const completeJob = catchAsync(async (req, res) => {
  const { finalAmount, providerNotes } = req.body;
  const provider = await Provider.findOne({ user: req.user._id });
  if (!provider) throw new AppError('Provider not found', 404);

  const booking = await Booking.findOne({ _id: req.params.id, provider: provider._id });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'in_progress') throw new AppError('Job not in progress', 400);
  if (finalAmount == null || finalAmount <= 0) {
    throw new AppError('Final amount is required and must be > 0', 400);
  }

  booking.status = 'completed';
  booking.finalAmount = finalAmount;
  booking.providerNotes = providerNotes || '';
  pushTimeline(booking, 'completed', 'Provider completed the job');
  await booking.save();

  // Update provider stats
  provider.completedJobs += 1;
  await provider.save();

  const io = req.app.get('io');
  io?.to(`user:${booking.customer}`).emit('booking:completed', { bookingId: booking._id, finalAmount });
  await Notification.create({
    user: booking.customer,
    title: 'Job Completed',
    message: `Your booking ${booking.bookingId} is complete. Amount: Rs.${finalAmount}. Please pay now.`,
    type: 'payment',
  });

  res.json({ success: true, data: booking });
});

/* ─── 9. Admin: all bookings ─── */
export const getAllBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find()
    .populate('service', 'name')
    .populate('customer', 'name')
    .populate({ path: 'provider', select: 'fullName shopName' })
    .sort('-createdAt')
    .limit(100);
  res.json({ success: true, data: bookings });
});
