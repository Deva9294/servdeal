import crypto from 'crypto';
import Razorpay from 'razorpay';
import Stripe from 'stripe';

let razorpay;
let stripe;

export const getRazorpay = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

export const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

export const isRazorpayConfigured = () =>
  Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export const createRazorpayOrder = async (amountInr, receipt, notes = {}) => {
  const rzp = getRazorpay();
  if (!rzp) throw new Error('Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env');
  return rzp.orders.create({
    amount: Math.round(amountInr * 100),
    currency: 'INR',
    receipt: String(receipt).slice(0, 40),
    notes,
  });
};

/** Verify Razorpay payment signature (server-side) */
export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return expected === signature;
  }
};

export const verifyRazorpayWebhook = (rawBody, signature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return expected === signature;
  }
};

export const calculateCommission = (amount) => {
  const rate = Number(process.env.PLATFORM_COMMISSION || 15) / 100;
  const commission = Math.round(amount * rate);
  return { commission, providerEarning: amount - commission };
};
