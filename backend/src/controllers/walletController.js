import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import PaymentLog from '../models/PaymentLog.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import { sendWalletRechargeEmail } from '../services/emailService.js';
import { verifyPayuResponseHash } from '../services/paymentService.js';

const generateTxnId = () => `TXN${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export const creditWallet = async ({ userId, paymentId, amount, gateway, gatewayOrderId, gatewayPaymentId, description, processedBy = 'callback', ip, userAgent }) => {
  const session = await Wallet.startSession();
  let result = null;

  await session.withTransaction(async () => {
    const existingTxn = await WalletTransaction.findOne({ payment: paymentId, status: 'success' }).session(session);
    if (existingTxn) {
      await PaymentLog.create([{
        payment: paymentId,
        user: userId,
        gateway,
        gatewayOrderId,
        gatewayPaymentId,
        amount,
        status: 'duplicate',
        errorMessage: 'Duplicate transaction prevented',
        ipAddress: ip,
        userAgent,
        processedBy,
      }], { session });
      result = { duplicate: true, walletTransaction: existingTxn };
      return;
    }

    let wallet = await Wallet.findOne({ user: userId }).session(session);
    if (!wallet) {
      wallet = await Wallet.create([{ user: userId }], { session });
      wallet = wallet[0];
    }

    const newBalance = wallet.balance + amount;

    await Wallet.findOneAndUpdate(
      { user: userId },
      { balance: newBalance },
      { session }
    );

    const txn = await WalletTransaction.create([{
      user: userId,
      wallet: wallet._id,
      transactionId: generateTxnId(),
      payuTxnId: gatewayPaymentId,
      payment: paymentId,
      amount,
      type: 'credit',
      status: 'success',
      description: description || 'Wallet top-up',
      processedAt: new Date(),
    }], { session });

    await PaymentLog.create([{
      payment: paymentId,
      user: userId,
      gateway,
      gatewayOrderId,
      gatewayPaymentId,
      amount,
      status: 'paid',
      hashVerified: true,
      hashMatch: true,
      ipAddress: ip,
      userAgent,
      processedBy,
    }], { session });

    await User.findByIdAndUpdate(userId, { walletBalance: newBalance }).session(session);

    await Notification.create([{
      user: userId,
      title: 'Wallet Recharge Successful',
      message: `₹${amount.toLocaleString('en-IN')} added to your wallet. New balance: ₹${newBalance.toLocaleString('en-IN')}`,
      type: 'payment',
      metadata: { transactionId: txn[0].transactionId, amount },
    }], { session });

    result = { duplicate: false, walletTransaction: txn[0], newBalance };
  });

  await session.endSession();
  return result;
};

export const getWallet = catchAsync(async (req, res) => {
  let wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) wallet = await Wallet.create({ user: req.user._id });

  const summary = await WalletTransaction.aggregate([
    { $match: { user: wallet.user, status: 'success' } },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const creditTotal = summary.find((s) => s._id === 'credit')?.total || 0;
  const debitTotal = summary.find((s) => s._id === 'debit')?.total || 0;

  res.json({
    success: true,
    data: {
      balance: wallet.balance,
      pendingBalance: wallet.pendingBalance,
      totalCredited: creditTotal,
      totalDebited: debitTotal,
      user: req.user._id,
    },
  });
});

export const getWalletTransactions = catchAsync(async (req, res) => {
  const { status, type, page = 1, limit = 20 } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (type) filter.type = type;

  const skip = (Number(page) - 1) * Number(limit);

  const [transactions, total] = await Promise.all([
    WalletTransaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    WalletTransaction.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { transactions, total, page: Number(page), limit: Number(limit) },
  });
});

export const getWalletStats = catchAsync(async (req, res) => {
  const stats = await WalletTransaction.aggregate([
    {
      $group: {
        _id: null,
        totalVolume: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0] } },
        totalTransactions: { $sum: 1 },
        successfulCount: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
        failedCount: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
        pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
      },
    },
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStats = await WalletTransaction.aggregate([
    { $match: { createdAt: { $gte: today }, status: 'success' } },
    { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    data: {
      overall: stats[0] || { totalVolume: 0, totalTransactions: 0, successfulCount: 0, failedCount: 0, pendingCount: 0 },
      today: todayStats[0] || { total: 0, count: 0 },
    },
  });
});

export const getAllWalletTransactions = catchAsync(async (req, res) => {
  const { status, type, gateway, page = 1, limit = 50, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;

  let userIds = [];
  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ],
    }).select('_id').lean();
    userIds = users.map((u) => u._id);
    filter.user = { $in: userIds };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [transactions, total] = await Promise.all([
    WalletTransaction.find(filter)
      .populate('user', 'name email phone')
      .populate('payment', 'gateway gatewayOrderId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    WalletTransaction.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { transactions, total, page: Number(page), limit: Number(limit) },
  });
});

export const getPaymentLogs = catchAsync(async (req, res) => {
  const { status, gateway, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (gateway) filter.gateway = gateway;

  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    PaymentLog.find(filter)
      .populate('user', 'name email')
      .populate('payment', 'amount metadata')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    PaymentLog.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: { logs, total, page: Number(page), limit: Number(limit) },
  });
});

export const getFailedPayments = catchAsync(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    PaymentLog.find({ status: { $in: ['failed', 'duplicate'] } })
      .populate('user', 'name email phone')
      .populate('payment', 'amount metadata')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    PaymentLog.countDocuments({ status: { $in: ['failed', 'duplicate'] } }),
  ]);

  res.json({
    success: true,
    data: { logs, total, page: Number(page), limit: Number(limit) },
  });
});
