import Refund from '../models/Refund.js';
import Booking from '../models/Booking.js';
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const requestRefund = catchAsync(async (req, res) => {
  const { bookingId, amount, reason } = req.body;

  const booking = await Booking.findOne({ _id: bookingId, customer: req.user._id });
  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.status === 'completed') throw new AppError('Cannot refund completed booking', 400);

  const existing = await Refund.findOne({ booking: bookingId, user: req.user._id, status: { $in: ['pending', 'approved', 'processing'] } });
  if (existing) throw new AppError('Refund already requested for this booking', 400);

  const refund = await Refund.create({
    user: req.user._id,
    booking: bookingId,
    payment: booking.payment,
    amount,
    reason,
    status: 'pending',
    refundMethod: 'wallet',
  });

  res.status(201).json({ success: true, data: refund });
});

export const getMyRefunds = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = { user: req.user._id };
  if (status && status !== 'all') filter.status = status;

  const [refunds, total] = await Promise.all([
    Refund.find(filter)
      .populate('booking', 'bookingId amount service status')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Refund.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: refunds,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

export const approveRefund = catchAsync(async (req, res) => {
  const refund = await Refund.findById(req.params.id);
  if (!refund) throw new AppError('Refund not found', 404);
  if (refund.status !== 'pending') throw new AppError('Refund already processed', 400);

  refund.status = 'approved';
  refund.approvedBy = req.user._id;
  refund.approvedAt = new Date();
  await refund.save();

  res.json({ success: true, data: refund });
});

export const processRefund = catchAsync(async (req, res) => {
  const refund = await Refund.findById(req.params.id);
  if (!refund) throw new AppError('Refund not found', 404);
  if (refund.status !== 'approved') throw new AppError('Refund must be approved first', 400);

  let wallet = await Wallet.findOne({ user: refund.user });
  if (!wallet) wallet = await Wallet.create({ user: refund.user });

  const txn = await WalletTransaction.create({
    user: refund.user,
    wallet: wallet._id,
    transactionId: `REF-${Date.now()}`,
    amount: refund.amount,
    type: 'refund',
    status: 'success',
    description: `Refund for booking ${refund.booking}`,
    metadata: { refundId: refund._id, bookingId: refund.booking },
    processedAt: new Date(),
  });

  wallet.balance += refund.amount;
  await wallet.save();

  refund.status = 'completed';
  refund.processedAt = new Date();
  refund.completedAt = new Date();
  refund.walletTransaction = txn._id;
  await refund.save();

  await Booking.findByIdAndUpdate(refund.booking, { paymentStatus: 'refunded' });

  res.json({ success: true, data: { refund, newBalance: wallet.balance } });
});

export const getAdminRefunds = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.status = status;

  const [refunds, total] = await Promise.all([
    Refund.find(filter)
      .populate('user', 'name email phone')
      .populate('booking', 'bookingId amount service')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Refund.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: refunds,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});
