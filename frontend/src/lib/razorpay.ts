import api from './api';

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export type RazorpayCheckoutResult = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type OpenCheckoutParams = {
  orderId: string;
  amount: number;
  keyId: string;
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
};

export async function openRazorpayCheckout(
  params: OpenCheckoutParams
): Promise<RazorpayCheckoutResult> {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error('Could not load Razorpay. Check your internet connection.');
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: params.keyId,
      amount: params.amount,
      currency: 'INR',
      name: params.name || 'ServDeal',
      description: params.description || 'Service payment',
      order_id: params.orderId,
      prefill: params.prefill,
      theme: { color: '#ff7a00' },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    });
    rzp.on('payment.failed', () => reject(new Error('Payment failed')));
    rzp.open();
  });
}

/** Create order on server → open checkout → verify signature on server */
export async function payWithRazorpay(options: {
  bookingId?: string;
  amount?: number;
  purpose?: 'booking' | 'wallet';
  description?: string;
}) {
  const { data } = await api.post('/payments/order', {
    bookingId: options.bookingId,
    amount: options.amount,
    purpose: options.purpose || 'booking',
  });

  const response = await openRazorpayCheckout({
    orderId: data.order.id,
    amount: data.order.amount,
    keyId: data.key,
    description: options.description,
    prefill: data.prefill,
  });

  const verify = await api.post('/payments/verify', {
    razorpay_order_id: response.razorpay_order_id,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_signature: response.razorpay_signature,
    bookingId: data.bookingId,
    paymentId: data.paymentId,
  });

  return verify.data;
}

export async function isRazorpayEnabled() {
  try {
    const { data } = await api.get('/payments/config');
    return Boolean(data.razorpay?.enabled && data.razorpay?.keyId);
  } catch {
    return Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY);
  }
}
