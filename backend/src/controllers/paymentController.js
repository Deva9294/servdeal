import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/AppError.js';
import {
  buildPayuPayload,
  verifyPayuResponseHash,
  isPayuConfigured,
} from '../services/paymentService.js';

// Create PayU order for a completed booking (post-service payment)
export const createOrder = catchAsync(async (req, res) => {
  const { bookingId } = req.body;
  if (!bookingId) throw new AppError('bookingId is required', 400);

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError('Booking not found', 404);
  if (String(booking.customer) !== String(req.user._id)) {
    throw new AppError('Not your booking', 403);
  }
  if (booking.status !== 'completed') {
    throw new AppError('Job not completed yet. Payment allowed only after completion.', 400);
  }
  if (booking.paymentStatus === 'paid') {
    throw new AppError('Payment already done for this booking', 400);
  }

  const payAmount = booking.finalAmount || booking.estimatedAmount || 0;
  if (!payAmount || payAmount < 1) throw new AppError('Invalid amount', 400);
  if (!isPayuConfigured()) {
    throw new AppError('PayU is not configured', 503);
  }

  const gatewayOrderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const payment = await Payment.create({
    booking: booking._id,
    user: req.user._id,
    amount: payAmount,
    gateway: 'payu',
    gatewayOrderId,
    status: 'created',
    invoiceNumber: `INV-${Date.now()}`,
    metadata: { purpose: 'booking', bookingId: String(booking._id) },
  });

  const payuPayload = buildPayuPayload({
    amount: payAmount,
    txnid: gatewayOrderId,
    productinfo: `Booking ${booking.bookingId}`,
    firstname: req.user.name || 'Customer',
    email: req.user.email || '',
    phone: req.user.phone || '',
    purpose: 'booking',
    bookingId: String(booking._id),
    paymentId: String(payment._id),
  });

  // Save payment link on booking
  booking.payuPaymentLink = payuPayload.action || '';
  await booking.save();

  res.json({
    success: true,
    gateway: 'payu',
    paymentId: payment._id,
    bookingId: booking._id,
    payu: payuPayload,
  });
});

// Verify PayU payment (API endpoint after redirect)
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

  const booking = await Booking.findByIdAndUpdate(
    payment.metadata?.bookingId,
    { paymentStatus: 'paid', status: 'paid', payuTxnId: String(mihpayid) },
    { new: true }
  );
  if (!booking) throw new AppError('Booking not found', 404);

  booking.timeline.push({ status: 'paid', note: 'Payment received via PayU' });
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
    message: `Booking ${booking.bookingId} paid`,
  });

  res.json({ success: true, data: { booking, payment } });
});

// PayU webhook / callback handler
export const payuCallback = catchAsync(async (req, res) => {
  const payload = req.method === 'GET' ? req.query : req.body;
  const valid = verifyPayuResponseHash(payload);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const { status, txnid, mihpayid } = payload;

  if (!valid) {
    return res.redirect(`${clientUrl}/dashboard?payment=failed`);
  }

  const payment = await Payment.findOneAndUpdate(
    { gatewayOrderId: String(txnid) },
    { status: status === 'success' ? 'paid' : 'failed', gatewayPaymentId: String(mihpayid) },
    { new: true }
  );
  if (!payment) {
    return res.redirect(`${clientUrl}/dashboard?payment=failed`);
  }

  if (status === 'success') {
    const booking = await Booking.findByIdAndUpdate(
      payment.metadata?.bookingId,
      { paymentStatus: 'paid', status: 'paid', payuTxnId: String(mihpayid) },
      { new: true }
    );
    if (booking) {
      booking.timeline.push({ status: 'paid', note: 'Payment received via PayU callback' });
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
        message: `Booking ${booking.bookingId} paid`,
      });
      return res.redirect(`${clientUrl}/dashboard/bookings/${booking._id}?payment=success`);
    }
  }

  return res.redirect(`${clientUrl}/dashboard?payment=failed`);
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
