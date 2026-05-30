import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import {
  buildPayuPayload,
  verifyPayuResponseHash,
  isPayuConfigured,
} from '../services/paymentService.js';

export const createOrder = catchAsync(async (req, res) => {
  if (!isPayuConfigured()) {
    throw new AppError('PayU is not configured on server', 503);
  }

  const { bookingId, amount, purpose } = req.body;
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

  const payment = await Payment.create({
    booking: booking?._id,
    user: req.user._id,
    amount: payAmount,
    gateway: 'payu',
    gatewayOrderId: `PAYU-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    status: 'created',
    gst: booking?.gst || 0,
    invoiceNumber: `INV-${Date.now()}`,
    metadata: {
      purpose: purpose || (booking ? 'booking' : 'wallet'),
      bookingId: booking?._id ? String(booking._id) : '',
    },
  });

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
  const valid = verifyPayuResponseHash(req.body);
  if (!valid) throw new AppError('Payment verification failed — invalid signature', 400);

  const { txnid, mihpayid, status } = req.body;

  const payment = await Payment.findOneAndUpdate(
    { gatewayOrderId: String(txnid) },
    { status: status === 'success' ? 'paid' : 'failed', gatewayPaymentId: String(mihpayid) },
    { new: true }
  );
  if (!payment) throw new AppError('Payment record not found', 404);

  if (status !== 'success') {
    return res.json({ success: false, status, payment });
  }

  if (payment.metadata?.purpose === 'wallet' || !payment.booking) {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) wallet = await Wallet.create({ user: req.user._id });
    wallet.balance += payment.amount;
    wallet.transactions.push({
      type: 'credit',
      amount: payment.amount,
      description: 'PayU wallet top-up',
    });
    await wallet.save();
    await User.findByIdAndUpdate(req.user._id, { walletBalance: wallet.balance });
    return res.json({ success: true, type: 'wallet', data: wallet });
  }

  const bookingId = payment.metadata?.bookingId || req.body.udf2;
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { paymentStatus: 'paid', status: 'confirmed' },
    { new: true }
  );
  if (!booking) throw new AppError('Booking not found', 404);

  booking.timeline.push({ status: 'confirmed', note: 'Payment received via PayU' });
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

  if (!valid) {
    return res.redirect(`${redirectBase}?payment=failed`);
  }

  const { status, txnid, mihpayid } = payload;
  const payment = await Payment.findOneAndUpdate(
    { gatewayOrderId: String(txnid) },
    { status: status === 'success' ? 'paid' : 'failed', gatewayPaymentId: String(mihpayid) },
    { new: true }
  );

  if (!payment) {
    return res.redirect(`${redirectBase}?payment=failed`);
  }

  if (status === 'success') {
    if (payment.metadata?.purpose === 'wallet' || !payment.booking) {
      let wallet = await Wallet.findOne({ user: payment.user });
      if (!wallet) wallet = await Wallet.create({ user: payment.user });
      wallet.balance += payment.amount;
      wallet.transactions.push({
        type: 'credit',
        amount: payment.amount,
        description: 'PayU wallet top-up',
      });
      await wallet.save();
      await User.findByIdAndUpdate(payment.user, { walletBalance: wallet.balance });
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

  return res.redirect(`${redirectBase}?payment=failed`);
});

export const walletTopUp = catchAsync(async (req, res) => {
  throw new AppError('Use PayU: POST /payments/order with purpose wallet, then complete the checkout flow.', 400);
});

export const getWallet = catchAsync(async (req, res) => {
  let wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) wallet = await Wallet.create({ user: req.user._id });
  res.json({ success: true, data: wallet });
});

export const getConfig = catchAsync(async (req, res) => {
  res.json({
    success: true,
    payu: {
      enabled: isPayuConfigured(),
      key: process.env.PAYU_KEY || null,
      env: process.env.PAYU_ENV || 'sandbox',
    },
  });
});
