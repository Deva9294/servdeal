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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const role = searchParams.get('role');

  const resolveRoleDestination = (userRole: string) => {
    if (userRole === 'admin' || userRole === 'superadmin') return '/admin';
    if (userRole === 'provider') return '/provider';
    if (userRole === 'worker') return '/worker';
    if (userRole === 'employer') return '/employer';
    return redirect;
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      const isProd = window.location.protocol === 'https:';
      const sameSite = isProd ? 'None' : 'Lax';
      const secure = isProd ? 'Secure' : '';
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=${sameSite}; ${secure}`.replace(/; $/, '');

      // Capture live location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            api.patch('/users/me', {
              location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
            }).catch(() => {});
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }

      toast.success(`Welcome back, ${data.user.name}!`);
      const roleDest = resolveRoleDestination(data.user.role);
      if (data.user.role === 'provider') {
        router.push('/provider/dashboard');
      } else {
        router.push(role === 'provider' ? '/provider' : roleDest);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
      const msg = axiosErr?.response?.data?.message;
      const status = axiosErr?.response?.status;
      if (status === 404) {
        toast.error('Backend API not reachable. Please try again later or contact support.');
      } else {
        toast.error(msg || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title={role === 'provider' ? 'Provider Login' : role === 'worker' ? 'Worker Login' : role === 'employer' ? 'Employer Login' : 'Welcome Back'}
      subtitle="Sign in to manage bookings and your account"
      footer={
        <>
          <Link href="/forgot-password" className="text-brand-orange hover:underline">
            Forgot password?
          </Link>
          <p className="mt-3 text-slate-600">
            New here?{' '}
            <Link href={`/signup${role ? `?role=${role}` : ''}`} className="font-semibold text-brand-orange hover:underline">
              Create account
            </Link>
          </p>
          <p className="mt-2">
            <Link href="/otp" className="text-brand-orange hover:underline">
              Login with OTP instead
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="py-20 text-center text-slate-600">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </PublicLayout>
  );
}
