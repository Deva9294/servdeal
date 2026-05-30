'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { setCredentials } from '@/store/authSlice';

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>(initialEmail ? 'otp' : 'email');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/email-otp/send', { email });
      toast.success(data.message);
      if (data.otp) toast(`Dev OTP: ${data.otp}`, { duration: 15000 });
      setStep('otp');
      startCountdown();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/email-otp/verify', { email, otp });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      const isProd = window.location.protocol === 'https:';
      const sameSite = isProd ? 'None' : 'Lax';
      const secure = isProd ? 'Secure' : '';
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=${sameSite}; ${secure}`.replace(/; $/, '');
      toast.success('Logged in successfully!');
      const dest =
        data.user.role === 'admin' || data.user.role === 'superadmin'
          ? '/admin'
          : data.user.role === 'provider'
            ? '/provider/dashboard'
            : data.user.role === 'worker'
              ? '/worker'
              : data.user.role === 'employer'
                ? '/employer'
                : '/dashboard';
      router.push(dest);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      const { data } = await api.post('/auth/resend-email-otp', { email });
      toast.success(data.message);
      if (data.otp) toast(`Dev OTP: ${data.otp}`, { duration: 15000 });
      startCountdown();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to resend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Email OTP Login"
      subtitle="Secure login with email verification"
      footer={
        <Link href="/login" className="text-brand-orange hover:underline">
          Back to password login
        </Link>
      }
    >
      {step === 'email' ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email Address</label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <p className="text-sm text-slate-600">
            OTP sent to <strong>{email}</strong>{' '}
            <button type="button" className="text-brand-orange hover:underline" onClick={() => setStep('email')}>
              Change
            </button>
          </p>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Enter 6-digit OTP</label>
            <Input required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Login'}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={resendOtp}
              disabled={countdown > 0 || loading}
              className="text-sm text-brand-orange hover:underline disabled:text-slate-400"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
            </button>
          </div>
        </form>
      )}
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="py-20 text-center text-slate-600">Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </PublicLayout>
  );
}
