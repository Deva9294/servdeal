import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const rebookService = catchAsync(async (req, res) => {
  const originalBooking = await Booking.findOne({ _id: req.params.bookingId, customer: req.user._id })
    .populate('service')
    .populate('provider');
  if (!originalBooking) throw new AppError('Original booking not found', 404);

  const service = await Service.findById(originalBooking.service);
  if (!service) throw new AppError('Service no longer available', 404);

  const newBooking = await Booking.create({
    customer: req.user._id,
    provider: originalBooking.provider,
    service: originalBooking.service,
    packageName: originalBooking.packageName,
    scheduledAt: req.body.scheduledAt || new Date(Date.now() + 24 * 60 * 60 * 1000),
    address: req.body.address || originalBooking.address,
    amount: req.body.amount || originalBooking.amount,
    baseAmount: originalBooking.baseAmount,
    commission: originalBooking.commission,
    providerEarning: originalBooking.providerEarning,
    paymentMethod: req.body.paymentMethod || originalBooking.paymentMethod,
    status: 'pending',
    notes: req.body.notes || `Rebooked from ${originalBooking.bookingId}`,
    timeline: [{ status: 'pending', note: `Rebooked from booking ${originalBooking.bookingId}` }],
  });

  res.status(201).json({
    success: true,
    data: newBooking,
    message: 'Service rebooked successfully',
  });
});

export const getRebookableBookings = catchAsync(async (req, res) => {
  const bookings = await Booking.find({
    customer: req.user._id,
    status: 'completed',
  })
    .populate('service', 'name slug basePrice')
    .populate('provider', 'businessName user')
    .sort('-completedAt')
    .limit(20);

  res.json({ success: true, data: bookings });
});
