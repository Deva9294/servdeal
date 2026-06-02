import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const fromEmail = process.env.EMAIL_FROM || 'noreply@servdeal.in';

export const isEmailConfigured = () => Boolean(resend && fromEmail);

const otpEmailTemplate = (name, otp) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
    .container { max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px 32px; }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo h1 { color: #1e293b; font-size: 24px; margin: 0; }
    .code { background: #fff7ed; border: 2px dashed #f97316; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .code .digits { font-size: 36px; font-weight: 700; color: #1e293b; letter-spacing: 8px; }
    .note { color: #64748b; font-size: 14px; line-height: 1.6; }
    .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo"><h1>ServDeal</h1></div>
    <p style="color:#334155;font-size:16px;">Hi ${name || 'there'},</p>
    <p style="color:#334155;font-size:16px;">Your verification code is:</p>
    <div class="code">
      <div class="digits">${otp}</div>
    </div>
    <p class="note">This code expires in 5 minutes. Do not share it with anyone.</p>
    <div class="footer">
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p style="margin-top:8px;">&copy; ServDeal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

const passwordResetTemplate = (name, otp) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
    .container { max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px 32px; }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo h1 { color: #1e293b; font-size: 24px; margin: 0; }
    .code { background: #fef2f2; border: 2px dashed #ef4444; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .code .digits { font-size: 36px; font-weight: 700; color: #1e293b; letter-spacing: 8px; }
    .note { color: #64748b; font-size: 14px; line-height: 1.6; }
    .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo"><h1>ServDeal</h1></div>
    <p style="color:#334155;font-size:16px;">Hi ${name || 'there'},</p>
    <p style="color:#334155;font-size:16px;">We received a request to reset your password. Your reset code is:</p>
    <div class="code">
      <div class="digits">${otp}</div>
    </div>
    <p class="note">This code expires in 5 minutes. If you didn't request a password reset, please ignore this email.</p>
    <div class="footer">
      <p>&copy; ServDeal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

export const sendEmailOtp = async (to, name, otp) => {
  if (!resend) throw new Error('Resend not configured. Set RESEND_API_KEY env var.');
  const { error } = await resend.emails.send({
    from: `ServDeal <${fromEmail}>`,
    to,
    subject: 'Your ServDeal Verification Code',
    html: otpEmailTemplate(name, otp),
  });
  if (error) throw new Error(error.message);
  return true;
};

export const sendPasswordResetEmail = async (to, name, otp) => {
  if (!resend) throw new Error('Resend not configured. Set RESEND_API_KEY env var.');
  const { error } = await resend.emails.send({
    from: `ServDeal <${fromEmail}>`,
    to,
    subject: 'Reset Your ServDeal Password',
    html: passwordResetTemplate(name, otp),
  });
  if (error) throw new Error(error.message);
  return true;
};

const walletRechargeTemplate = (name, amount, balance, txnId) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f4f4f5; margin: 0; padding: 20px; }
    .container { max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 40px 32px; }
    .logo { text-align: center; margin-bottom: 24px; }
    .logo h1 { color: #1e293b; font-size: 24px; margin: 0; }
    .success { background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .success .amount { font-size: 32px; font-weight: 700; color: #15803d; }
    .details { background: #f8fafc; border-radius: 12px; padding: 16px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #64748b; }
    .value { color: #1e293b; font-weight: 600; }
    .footer { text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo"><h1>ServDeal</h1></div>
    <p style="color:#334155;font-size:16px;">Hi ${name || 'there'},</p>
    <p style="color:#334155;font-size:16px;">Your wallet has been successfully recharged!</p>
    <div class="success">
      <div class="amount">+ ₹${amount.toLocaleString('en-IN')}</div>
      <p style="color:#15803d;font-size:14px;margin-top:8px;">Payment Successful</p>
    </div>
    <div class="details">
      <div class="detail-row"><span class="label">Transaction ID</span><span class="value">${txnId}</span></div>
      <div class="detail-row"><span class="label">Current Balance</span><span class="value">₹${balance.toLocaleString('en-IN')}</span></div>
      <div class="detail-row"><span class="label">Date</span><span class="value">${new Date().toLocaleDateString('en-IN')}</span></div>
    </div>
    <p style="color:#64748b;font-size:14px;">You can now use this balance to book services on ServDeal.</p>
    <div class="footer">
      <p>&copy; ServDeal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

export const sendWalletRechargeEmail = async (to, name, amount, balance, txnId) => {
  if (!resend) return false;
  const { error } = await resend.emails.send({
    from: `ServDeal <${fromEmail}>`,
    to,
    subject: `Wallet Recharge Successful - ₹${amount.toLocaleString('en-IN')} added`,
    html: walletRechargeTemplate(name, amount, balance, txnId),
  });
  if (error) console.error('Wallet recharge email failed:', error.message);
  return !error;
};
