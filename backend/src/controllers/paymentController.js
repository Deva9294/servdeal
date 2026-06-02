import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import PaymentLog from '../models/PaymentLog.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import { sendWalletRechargeEmail } from '../services/emailService.js';
import {
  buildPayuPayload,
  verifyPayuResponseHash,
  isPayuConfigured,
  isRazorpayConfigured,
  createRazorpayOrder,
  verifyRazorpaySignature,
} from '../services/paymentService.js';
import { creditWallet } from './walletController.js';

export const createOrder = catchAsync(async (req, res) => {
  const { bookingId, amount, purpose, gateway } = req.body;
  let booking;
  let payAmount = amount;

  if (bookingId) {
    booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.customer.toString() !== req.user._id.toString()) {
      throw new AppError('Not your booking', 403);
    }
    payAmount = booking.amount;
  }

  if (!payAmount || payAmount < 1) throw new AppError('Invalid amount', 400);

  const selectedGateway = gateway || (isPayuConfigured() ? 'payu' : isRazorpayConfigured() ? 'razorpay' : null);
  if (!selectedGateway) {
    throw new AppError('No payment gateway is configured on server', 503);
  }

  const payment = await Payment.create({
    booking: booking?._id,
    user: req.user._id,
    amount: payAmount,
    gateway: selectedGateway,
    gatewayOrderId: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    status: 'created',
    gst: booking?.gst || 0,
    invoiceNumber: `INV-${Date.now()}`,
    metadata: {
      purpose: purpose || (booking ? 'booking' : 'wallet'),
      bookingId: booking?._id ? String(booking._id) : '',
    },
  });

  if (selectedGateway === 'razorpay') {
    const order = await createRazorpayOrder({
      amount: payAmount,
      receipt: payment.gatewayOrderId,
    });
    payment.gatewayOrderId = order.id;
    await payment.save();

    return res.json({
      success: true,
      gateway: 'razorpay',
      paymentId: payment._id,
      bookingId: booking?._id,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      prefill: {
        name: req.user.name || 'Customer',
        email: req.user.email || '',
        contact: req.user.phone || '',
      },
    });
  }

  const payuPayload = buildPayuPayload({
    amount: payAmount,
    txnid: payment.gatewayOrderId,
    productinfo: purpose || (booking ? `Booking ${booking.bookingId}` : 'Wallet Topup'),
    firstname: req.user.name || 'Customer',
    email: req.user.email || '',
    phone: req.user.phone || '',
    purpose: payment.metadata.purpose,
    bookingId: booking?._id ? String(booking._id) : '',
    paymentId: String(payment._id),
  });

  res.json({
    success: true,
    gateway: 'payu',
    paymentId: payment._id,
    bookingId: booking?._id,
    payu: payuPayload,
  });
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { gateway } = req.body;
  let payment;

  if (gateway === 'razorpay') {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const valid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });
    if (!valid) throw new AppError('Razorpay verification failed — invalid signature', 400);

    payment = await Payment.findOneAndUpdate(
      { gatewayOrderId: String(razorpay_order_id) },
      { status: 'paid', gatewayPaymentId: String(razorpay_payment_id) },
      { new: true }
    );
    if (!payment) throw new AppError('Payment record not found', 404);
  } else {
    const valid = verifyPayuResponseHash(req.body);
    if (!valid) throw new AppError('Payment verification failed — invalid signature', 400);

    const { txnid, mihpayid, status } = req.body;
    payment = await Payment.findOneAndUpdate(
      { gatewayOrderId: String(txnid) },
      { status: status === 'success' ? 'paid' : 'failed', gatewayPaymentId: String(mihpayid) },
      { new: true }
    );
    if (!payment) throw new AppError('Payment record not found', 404);
    if (status !== 'success') {
      return res.json({ success: false, status, payment });
    }
  }

  if (payment.metadata?.purpose === 'wallet' || !payment.booking) {
    const result = await creditWallet({
      userId: req.user._id,
      paymentId: payment._id,
      amount: payment.amount,
      gateway: payment.gateway,
      gatewayOrderId: payment.gatewayOrderId,
      gatewayPaymentId: payment.gatewayPaymentId,
      description: 'Wallet top-up',
      processedBy: 'api_verify',
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    if (result.duplicate) {
      return res.json({ success: true, type: 'wallet', duplicate: true, data: result.walletTransaction });
    }

    const user = await User.findById(req.user._id);
    await sendWalletRechargeEmail(user.email, user.name, payment.amount, result.newBalance, result.walletTransaction.transactionId);

    return res.json({ success: true, type: 'wallet', data: { balance: result.newBalance, transaction: result.walletTransaction } });
  }

  const bookingId = payment.metadata?.bookingId || req.body.udf2;
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { paymentStatus: 'paid', status: 'confirmed' },
    { new: true }
  );
  if (!booking) throw new AppError('Booking not found', 404);

  booking.timeline.push({ status: 'confirmed', note: 'Payment received' });
  await booking.save();

  await Notification.create({
    user: req.user._id,
    title: 'Payment Successful',
    message: `₹${payment.amount} paid for booking ${booking.bookingId}`,
    type: 'payment',
  });

  const io = req.app.get('io');
  io?.to(`user:${req.user._id}`).emit('notification', {
    title: 'Payment Successful',
    message: `Booking ${booking.bookingId} confirmed`,
  });

  res.json({ success: true, type: 'booking', data: booking, payment });
});

export const payuCallback = catchAsync(async (req, res) => {
  const payload = req.method === 'GET' ? req.query : req.body;
  const valid = verifyPayuResponseHash(payload);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const redirectBase = `${clientUrl}/dashboard`;

  const { status, txnid, mihpayid } = payload;

  if (!valid) {
    if (txnid) {
      await PaymentLog.create({
        gatewayOrderId: String(txnid),
        gatewayPaymentId: String(mihpayid),
        gateway: 'payu',
        amount: Number(payload.amount) || 0,
        status: 'failed',
        hashVerified: true,
        hashMatch: false,
        errorMessage: 'Hash verification failed',
        responseBody: payload,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        processedBy: 'callback',
      });
    }
    return res.redirect(`${redirectBase}?payment=failed`);
  }

  const payment = await Payment.findOneAndUpdate(
    { gatewayOrderId: String(txnid) },
    { status: status === 'success' ? 'paid' : 'failed', gatewayPaymentId: String(mihpayid) },
    { new: true }
  );

  if (!payment) {
    await PaymentLog.create({
      gatewayOrderId: String(txnid),
      gatewayPaymentId: String(mihpayid),
      gateway: 'payu',
      amount: Number(payload.amount) || 0,
      status: 'failed',
      hashVerified: true,
      hashMatch: true,
      errorMessage: 'Payment record not found in database',
      responseBody: payload,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      processedBy: 'callback',
    });
    return res.redirect(`${redirectBase}?payment=failed`);
  }

  if (status === 'success') {
    if (payment.metadata?.purpose === 'wallet' || !payment.booking) {
      const result = await creditWallet({
        userId: payment.user,
        paymentId: payment._id,
        amount: payment.amount,
        gateway: 'payu',
        gatewayOrderId: payment.gatewayOrderId,
        gatewayPaymentId: String(mihpayid),
        description: 'PayU wallet top-up',
        processedBy: 'callback',
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });

      if (!result.duplicate) {
        const user = await User.findById(payment.user);
        if (user?.email) {
          await sendWalletRechargeEmail(user.email, user.name, payment.amount, result.newBalance, result.walletTransaction.transactionId);
        }
      }

      return res.redirect(`${clientUrl}/dashboard/wallet?payment=success`);
    }

    const bookingId = payment.metadata?.bookingId;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus: 'paid', status: 'confirmed' },
      { new: true }
    );
    if (booking) {
      booking.timeline.push({ status: 'confirmed', note: 'Payment received via PayU' });
      await booking.save();
      await Notification.create({
        user: payment.user,
        title: 'Payment Successful',
        message: `₹${payment.amount} paid for booking ${booking.bookingId}`,
        type: 'payment',
      });
      const io = req.app.get('io');
      io?.to(`user:${payment.user}`).emit('notification', {
        title: 'Payment Successful',
        message: `Booking ${booking.bookingId} confirmed`,
      });
      return res.redirect(`${clientUrl}/dashboard/bookings/${booking._id}?payment=success`);
    }
  }

  await PaymentLog.create({
    payment: payment._id,
    user: payment.user,
    gateway: 'payu',
    gatewayOrderId: payment.gatewayOrderId,
    gatewayPaymentId: String(mihpayid),
    amount: payment.amount,
    status: 'failed',
    hashVerified: true,
    hashMatch: true,
    responseBody: payload,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    processedBy: 'callback',
  });

  return res.redirect(`${redirectBase}?payment=failed`);
});

export const walletTopUp = catchAsync(async (req, res) => {
  throw new AppError('Use PayU: POST /payments/order with purpose wallet, then complete the checkout flow.', 400);
});

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

export const getConfig = catchAsync(async (req, res) => {
  res.json({
    success: true,
    payu: {
      enabled: isPayuConfigured(),
      key: process.env.PAYU_KEY || null,
      env: process.env.PAYU_ENV || 'sandbox',
    },
    razorpay: {
      enabled: isRazorpayConfigured(),
      keyId: process.env.RAZORPAY_KEY_ID || null,
    },
  });
});
