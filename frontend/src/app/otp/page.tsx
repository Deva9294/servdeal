'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { setCredentials } from '@/store/authSlice';

export default function OtpPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/otp/send', { phone: phone.replace(/\D/g, '') });
      toast.success(data.message || 'OTP sent to your mobile');
      if (data.otp) toast(`Dev OTP (SMS off): ${data.otp}`, { duration: 15000 });
      setPhone(data.phone || phone);
      setStep('otp');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const msg = axiosErr?.response?.data?.message;
      const status = axiosErr?.response?.status;
      if (status === 404) {
        toast.error('Backend API not reachable. Please try again later or contact support.');
      } else {
        toast.error(msg || 'Failed to send OTP. Check your number and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/otp/verify', { phone, otp });
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
            : '/dashboard';
      router.push(dest);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <AuthCard
        title="Login with OTP"
        subtitle="Quick sign-in using your Indian mobile number"
        footer={
          <Link href="/login" className="text-brand-orange hover:underline">
            Use email & password instead
          </Link>
        }
      >
        {step === 'phone' ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Mobile Number</label>
              <Input type="tel" required maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="9876543210" />
              <p className="text-xs text-slate-500">10-digit Indian mobile (SMS OTP)</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <p className="text-sm text-slate-600">
              OTP sent to <strong>{phone}</strong>{' '}
              <button type="button" className="text-brand-orange hover:underline" onClick={() => setStep('phone')}>
                Change
              </button>
            </p>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Enter OTP</label>
              <Input required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
          </form>
        )}
      </AuthCard>
    </PublicLayout>
  );
}
