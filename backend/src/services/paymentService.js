import crypto from 'crypto';
import Stripe from 'stripe';

let stripe;

export const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

const PAYU_ACTION_URL =
  process.env.PAYU_ENV === 'production'
    ? 'https://secure.payu.in/_payment'
    : 'https://sandboxsecure.payu.in/_payment';

export const isPayuConfigured = () =>
  Boolean(process.env.PAYU_KEY && process.env.PAYU_SALT);

const buildPayuHash = ({
  key,
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  udf1 = '',
  udf2 = '',
  udf3 = '',
  udf4 = '',
  udf5 = '',
  udf6 = '',
  udf7 = '',
  udf8 = '',
  udf9 = '',
  udf10 = '',
}) => {
  const salt = process.env.PAYU_SALT;
  const values = [
    key,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    udf2,
    udf3,
    udf4,
    udf5,
    udf6,
    udf7,
    udf8,
    udf9,
    udf10,
    salt,
  ];
  return crypto.createHash('sha512').update(values.join('|')).digest('hex');
};

export const buildPayuPayload = ({
  amount,
  txnid,
  productinfo,
  firstname,
  email,
  phone,
  purpose,
  bookingId,
  paymentId,
}) => {
  if (!isPayuConfigured()) {
    throw new Error('PayU is not configured. Add PAYU_KEY and PAYU_SALT to .env');
  }

  const payload = {
    key: process.env.PAYU_KEY,
    txnid,
    amount: Number(amount).toFixed(2),
    productinfo,
    firstname,
    email,
    phone,
    surl: `${process.env.SERVER_URL || process.env.CLIENT_URL || 'http://localhost:5000'}/api/v1/payments/payu/callback`,
    furl: `${process.env.SERVER_URL || process.env.CLIENT_URL || 'http://localhost:5000'}/api/v1/payments/payu/callback`,
    service_provider: 'payu_paisa',
    udf1: purpose || '',
    udf2: bookingId ? String(bookingId) : '',
    udf3: paymentId ? String(paymentId) : '',
    udf4: '',
    udf5: '',
    udf6: '',
    udf7: '',
    udf8: '',
    udf9: '',
    udf10: '',
  };

  return {
    ...payload,
    hash: buildPayuHash(payload),
    action: PAYU_ACTION_URL,
  };
};

export const verifyPayuResponseHash = (data) => {
  const salt = process.env.PAYU_SALT;
  if (!salt) return false;

  const {
    status = '',
    firstname = '',
    email = '',
    productinfo = '',
    amount = '',
    txnid = '',
    key = '',
    hash = '',
    udf1 = '',
    udf2 = '',
    udf3 = '',
    udf4 = '',
    udf5 = '',
    udf6 = '',
    udf7 = '',
    udf8 = '',
    udf9 = '',
    udf10 = '',
  } = data;

  const values = [
    salt,
    status,
    udf10,
    udf9,
    udf8,
    udf7,
    udf6,
    udf5,
    udf4,
    udf3,
    udf2,
    udf1,
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    key,
  ];

  const expected = crypto.createHash('sha512').update(values.join('|')).digest('hex');
  return expected === String(hash);
};

export const calculateCommission = (amount) => {
  const rate = Number(process.env.PLATFORM_COMMISSION || 15) / 100;
  const commission = Math.round(amount * rate);
  return { commission, providerEarning: amount - commission };
};
