import Cashback from '../models/Cashback.js';
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';

export const getMyCashback = catchAsync(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = { user: req.user._id };
  if (status && status !== 'all') filter.status = status;

  const [cashbacks, total] = await Promise.all([
    Cashback.find(filter)
      .populate('booking', 'bookingId amount service')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Cashback.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: cashbacks,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  });
});

export const getCashbackStats = catchAsync(async (req, res) => {
  const [totalPending, totalCredited, totalExpired] = await Promise.all([
    Cashback.aggregate([
      { $match: { user: req.user._id, status: 'pending' } },
      { $group: { _id: null, amount: { $sum: '$amount' } } },
    ]),
    Cashback.aggregate([
      { $match: { user: req.user._id, status: 'credited' } },
      { $group: { _id: null, amount: { $sum: '$amount' } } },
    ]),
    Cashback.aggregate([
      { $match: { user: req.user._id, status: 'expired' } },
      { $group: { _id: null, amount: { $sum: '$amount' } } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      pending: totalPending[0]?.amount || 0,
      credited: totalCredited[0]?.amount || 0,
      expired: totalExpired[0]?.amount || 0,
    },
  });
});

export const processCashback = catchAsync(async (req, res) => {
  const { bookingId, amount, percentage, type, description, expiresInDays = 30 } = req.body;
  const userId = req.user._id;

  const cashback = await Cashback.create({
    user: userId,
    amount,
    percentage,
    type,
    description,
    expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
  });

  res.status(201).json({ success: true, data: cashback });
});

export const creditCashback = catchAsync(async (req, res) => {
  const { cashbackId } = req.params;
  const cashback = await Cashback.findById(cashbackId);
  if (!cashback) throw new AppError('Cashback not found', 404);
  if (cashback.status !== 'pending') throw new AppError('Cashback already processed', 400);
  if (cashback.expiresAt && new Date() > cashback.expiresAt) {
    cashback.status = 'expired';
    await cashback.save();
    throw new AppError('Cashback has expired', 400);
  }

  let wallet = await Wallet.findOne({ user: cashback.user });
  if (!wallet) wallet = await Wallet.create({ user: cashback.user });

  const txn = await WalletTransaction.create({
    user: cashback.user,
    wallet: wallet._id,
    transactionId: `CB-${Date.now()}`,
    amount: cashback.amount,
    type: 'credit',
    status: 'success',
    description: `Cashback: ${cashback.description}`,
    metadata: { cashbackId: cashback._id },
    processedAt: new Date(),
  });

  wallet.balance += cashback.amount;
  await wallet.save();

  cashback.status = 'credited';
  cashback.creditedAt = new Date();
  cashback.walletTransaction = txn._id;
  await cashback.save();

  res.json({ success: true, data: { cashback, newBalance: wallet.balance } });
});

// Auto-credit cashback on booking completion
export const autoCreditBookingCashback = async (userId, bookingId, amount, type = 'booking') => {
  const cashbackPercent = type === 'membership' ? 10 : type === 'promotional' ? 15 : 5;
  const cashbackAmount = Math.round((amount * cashbackPercent) / 100);
  if (cashbackAmount <= 0) return null;

  const cashback = await Cashback.create({
    user: userId,
    amount: cashbackAmount,
    percentage: cashbackPercent,
    type,
    description: `${cashbackPercent}% cashback on booking`,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) wallet = await Wallet.create({ user: userId });

  const txn = await WalletTransaction.create({
    user: userId,
    wallet: wallet._id,
    transactionId: `CB-${Date.now()}`,
    amount: cashbackAmount,
    type: 'credit',
    status: 'success',
    description: `Cashback: ${cashbackPercent}% on booking`,
    metadata: { cashbackId: cashback._id, bookingId },
    processedAt: new Date(),
  });

  wallet.balance += cashbackAmount;
  await wallet.save();

  cashback.status = 'credited';
  cashback.creditedAt = new Date();
  cashback.walletTransaction = txn._id;
  await cashback.save();

  return { cashback, newBalance: wallet.balance };
};

export const getAdminCashbackAnalytics = catchAsync(async (req, res) => {
  const [totalIssued, totalCredited, totalPending, totalExpired] = await Promise.all([
    Cashback.aggregate([{ $group: { _id: null, amount: { $sum: '$amount' } } }]),
    Cashback.aggregate([{ $match: { status: 'credited' } }, { $group: { _id: null, amount: { $sum: '$amount' } } }]),
    Cashback.aggregate([{ $match: { status: 'pending' } }, { $group: { _id: null, amount: { $sum: '$amount' } } }]),
    Cashback.aggregate([{ $match: { status: 'expired' } }, { $group: { _id: null, amount: { $sum: '$amount' } } }]),
  ]);

  const byType = await Cashback.aggregate([
    { $group: { _id: '$type', count: { $sum: 1 }, amount: { $sum: '$amount' } } },
  ]);

  res.json({
    success: true,
    data: {
      totalIssued: totalIssued[0]?.amount || 0,
      totalCredited: totalCredited[0]?.amount || 0,
      totalPending: totalPending[0]?.amount || 0,
      totalExpired: totalExpired[0]?.amount || 0,
      byType,
    },
  });
});
