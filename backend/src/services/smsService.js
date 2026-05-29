import { normalizeIndianPhone, toE164Indian } from '../utils/phone.js';

const BRAND = 'ServDeal';

/**
 * SMS providers: console (dev) | twilio | msg91
 * Set SMS_PROVIDER in .env
 */
export async function sendSmsOtp(phone, otp) {
  const normalized = normalizeIndianPhone(phone);
  if (!normalized) {
    throw new Error('Invalid Indian mobile number. Use 10 digits starting with 6-9.');
  }

  const provider = (process.env.SMS_PROVIDER || 'auto').toLowerCase();
  const message = `Your ${BRAND} OTP is ${otp}. Valid for ${process.env.OTP_EXPIRE_MINUTES || 10} minutes. Do not share with anyone.`;

  if (provider === 'console') {
    console.log(`[SMS:console] To +91${normalized}: ${message}`);
    return { success: true, provider: 'console' };
  }

  if (provider === 'twilio' || (provider === 'auto' && process.env.TWILIO_ACCOUNT_SID)) {
    return sendViaTwilio(normalized, message);
  }

  if (provider === 'msg91' || (provider === 'auto' && process.env.MSG91_AUTH_KEY)) {
    return sendViaMsg91(normalized, otp, message);
  }

  console.log(`[SMS:dev-console] To +91${normalized}: ${message}`);
  return { success: true, provider: 'dev-console' };
}

async function sendViaTwilio(phone10, body) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE;
  if (!sid || !token || !from) {
    throw new Error('Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE');
  }

  const auth = Buffer.from(`${sid}:${token}`).toString('base64');
  const params = new URLSearchParams({
    To: toE164Indian(phone10),
    From: from.startsWith('+') ? from : `+${from}`,
    Body: body,
  });

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twilio SMS failed: ${err}`);
  }
  return { success: true, provider: 'twilio' };
}

async function sendViaMsg91(phone10, otp, message) {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_OTP_TEMPLATE_ID;
  const sender = process.env.MSG91_SENDER_ID || 'SRVDEA';

  if (!authKey) {
    throw new Error('MSG91 not configured. Set MSG91_AUTH_KEY');
  }

  // MSG91 OTP API (recommended when template is approved)
  if (templateId) {
    const url = new URL('https://control.msg91.com/api/v5/otp');
    url.searchParams.set('otp', otp);
    url.searchParams.set('mobile', `91${phone10}`);
    url.searchParams.set('authkey', authKey);
    url.searchParams.set('template_id', templateId);

    const res = await fetch(url.toString(), { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok && data.type !== 'success') {
      throw new Error(data.message || 'MSG91 OTP send failed');
    }
    return { success: true, provider: 'msg91-otp' };
  }

  // Generic transactional SMS
  const res = await fetch('https://control.msg91.com/api/v5/flow/', {
    method: 'POST',
    headers: {
      authkey: authKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template_id: process.env.MSG91_FLOW_TEMPLATE_ID,
      short_url: '0',
      recipients: [
        {
          mobiles: `91${phone10}`,
          var1: otp,
          message,
        },
      ],
    }),
  });

  if (!res.ok) {
    const legacy = await fetch(
      `https://api.msg91.com/api/sendhttp.php?authkey=${authKey}&mobiles=91${phone10}&message=${encodeURIComponent(message)}&sender=${sender}&route=4&country=91`
    );
    if (!legacy.ok) throw new Error('MSG91 SMS send failed');
    return { success: true, provider: 'msg91-http' };
  }

  return { success: true, provider: 'msg91-flow' };
}
