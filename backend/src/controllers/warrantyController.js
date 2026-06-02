import Warranty from '../models/Warranty.js';
import Booking from '../models/Booking.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const createWarranty = catchAsync(async (req, res) => {
  const { bookingId, durationDays = 30, description, terms } = req.body;

  const booking = await Booking.findOne({ _id: bookingId, customer: req.user._id })
    .populate('service')
    .populate('provider');
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status !== 'completed') throw new AppError('Warranty only for completed bookings', 400);

  const existing = await Warranty.findOne({ booking: bookingId });
  if (existing) throw new AppError('Warranty already exists for this booking', 400);

  const startsAt = new Date();
  const expiresAt = new Date(startsAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

  const warranty = await Warranty.create({
    user: req.user._id,
    provider: booking.provider,
    booking: bookingId,
    service: booking.service,
    durationDays,
    startsAt,
    expiresAt,
    description,
    terms,
  });

  res.status(201).json({ success: true, data: warranty });
});

export const getMyWarranties = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = { user: req.user._id };
  if (status && status !== 'all') filter.status = status;

  const [warranties, total] = await Promise.all([
    Warranty.find(filter)
      .populate('service', 'name')
      .populate('provider', 'businessName')
      .populate('booking', 'bookingId amount')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Warranty.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: warranties,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

export const getWarranty = catchAsync(async (req, res) => {
  const warranty = await Warranty.findOne({ _id: req.params.id, user: req.user._id })
    .populate('service', 'name')
    .populate('provider', 'businessName user')
    .populate('booking', 'bookingId amount');
  if (!warranty) throw new AppError('Warranty not found', 404);
  res.json({ success: true, data: warranty });
});

export const submitClaim = catchAsync(async (req, res) => {
  const { reason, description, images } = req.body;
  const warranty = await Warranty.findOne({ _id: req.params.id, user: req.user._id });
  if (!warranty) throw new AppError('Warranty not found', 404);
  if (warranty.status !== 'active') throw new AppError('Warranty is not active', 400);
  if (new Date() > warranty.expiresAt) throw new AppError('Warranty has expired', 400);

  warranty.claim = {
    reason,
    description,
    images: images || [],
    status: 'submitted',
    submittedAt: new Date(),
  };
  warranty.status = 'claimed';
  await warranty.save();

  res.json({ success: true, data: warranty });
});

export const updateClaimStatus = catchAsync(async (req, res) => {
  const { status, resolution, refundAmount } = req.body;
  const warranty = await Warranty.findById(req.params.id);
  if (!warranty) throw new AppError('Warranty not found', 404);

  warranty.claim.status = status;
  if (resolution) warranty.claim.resolution = resolution;
  if (refundAmount !== undefined) warranty.claim.refundAmount = refundAmount;
  if (status === 'resolved') {
    warranty.claim.resolvedAt = new Date();
    warranty.status = 'resolved';
  } else if (status === 'rejected') {
    warranty.status = 'active';
  }
  await warranty.save();

  res.json({ success: true, data: warranty });
});

export const getAdminWarranties = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;

  const [warranties, total] = await Promise.all([
    Warranty.find(filter)
      .populate('user', 'name email phone')
      .populate('service', 'name')
      .populate('provider', 'businessName')
      .populate('booking', 'bookingId')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Warranty.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: warranties,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});
