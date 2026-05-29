import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyRazorpayWebhook,
  isRazorpayConfigured,
} from '../services/paymentService.js';

export const createOrder = catchAsync(async (req, res) => {
  if (!isRazorpayConfigured()) {
    throw new AppError('Razorpay is not configured on server', 503);
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

  const receipt = booking?.bookingId || `WALLET-${req.user._id}-${Date.now()}`;
  const order = await createRazorpayOrder(payAmount, receipt, {
    userId: String(req.user._id),
    purpose: purpose || (booking ? 'booking' : 'wallet'),
    bookingId: booking?._id ? String(booking._id) : '',
  });

  const payment = await Payment.create({
    booking: booking?._id,
    user: req.user._id,
    amount: payAmount,
    gateway: 'razorpay',
    gatewayOrderId: order.id,
    status: 'created',
    gst: booking?.gst || 0,
    invoiceNumber: `INV-${Date.now()}`,
    metadata: { purpose: purpose || (booking ? 'booking' : 'wallet') },
  });

  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
    order: {
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    },
    paymentId: payment._id,
    bookingId: booking?._id,
    prefill: {
      name: req.user.name,
      email: req.user.email,
      contact: req.user.phone,
    },
  });
});

export const verifyPayment = catchAsync(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, paymentId } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError('Missing Razorpay payment details', 400);
  }

  const valid = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );
  if (!valid) throw new AppError('Payment verification failed — invalid signature', 400);

  const payment = await Payment.findOneAndUpdate(
    { gatewayOrderId: razorpay_order_id },
    { status: 'paid', gatewayPaymentId: razorpay_payment_id },
    { new: true }
  );
  if (!payment) throw new AppError('Payment record not found', 404);

  if (payment.metadata?.purpose === 'wallet' || (!payment.booking && !bookingId)) {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) wallet = await Wallet.create({ user: req.user._id });
    wallet.balance += payment.amount;
    wallet.transactions.push({
      type: 'credit',
      amount: payment.amount,
      description: 'Razorpay wallet top-up',
    });
    await wallet.save();
    await User.findByIdAndUpdate(req.user._id, { walletBalance: wallet.balance });
    return res.json({ success: true, type: 'wallet', data: wallet });
  }

  const bId = bookingId || payment.booking;
  const booking = await Booking.findByIdAndUpdate(
    bId,
    { paymentStatus: 'paid', status: 'confirmed' },
    { new: true }
  );
  if (!booking) throw new AppError('Booking not found', 404);

  booking.timeline.push({ status: 'confirmed', note: 'Payment received via Razorpay' });
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

export const razorpayWebhook = catchAsync(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  if (!verifyRazorpayWebhook(rawBody, signature)) {
    throw new AppError('Invalid webhook signature', 400);
  }

  const event = req.body.event;
  const paymentEntity = req.body.payload?.payment?.entity;
  if (event === 'payment.captured' && paymentEntity) {
    await Payment.findOneAndUpdate(
      { gatewayOrderId: paymentEntity.order_id },
      { status: 'paid', gatewayPaymentId: paymentEntity.id }
    );
  }

  res.json({ success: true });
});

export const walletTopUp = catchAsync(async (req, res) => {
  throw new AppError('Use Razorpay: POST /payments/order with purpose wallet, then /payments/verify', 400);
});

export const getWallet = catchAsync(async (req, res) => {
  let wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) wallet = await Wallet.create({ user: req.user._id });
  res.json({ success: true, data: wallet });
});

export const getConfig = catchAsync(async (req, res) => {
  res.json({
    success: true,
    razorpay: {
      enabled: isRazorpayConfigured(),
      keyId: process.env.RAZORPAY_KEY_ID || null,
    },
  });
});
