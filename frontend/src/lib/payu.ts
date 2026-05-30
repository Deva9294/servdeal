import api from './api';

type PayuPayload = {
  action: string;
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone?: string;
  surl: string;
  furl: string;
  hash: string;
  service_provider: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  [key: string]: string | undefined;
};

const buildPayuForm = (payload: PayuPayload) => {
  if (typeof window === 'undefined') {
    throw new Error('PayU payment can only be initiated in the browser');
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = payload.action;
  form.style.display = 'none';

  Object.entries(payload).forEach(([key, value]) => {
    if (!value) return;
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

export async function payWithPayU(options: {
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

  const payload = data.payu;
  if (!payload?.action) {
    throw new Error('PayU payment initialization failed');
  }

  buildPayuForm(payload);
  return data;
}

export async function isPayuEnabled() {
  try {
    const { data } = await api.get('/payments/config');
    return Boolean(data.payu?.enabled && data.payu?.key);
  } catch {
    return false;
  }
}
