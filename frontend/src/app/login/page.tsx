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
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { setCredentials } from '@/store/authSlice';

const roles = [
  { key: 'customer', label: 'Customer', desc: 'Book home services' },
  { key: 'provider', label: 'Provider', desc: 'Offer your services' },
  { key: 'worker', label: 'Worker', desc: 'Find local jobs' },
  { key: 'employer', label: 'Employer', desc: 'Hire workers' },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const urlRole = searchParams.get('role');
  const [activeRole, setActiveRole] = useState(urlRole && roles.find(r => r.key === urlRole) ? urlRole : 'customer');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const resolveRoleDestination = (userRole: string) => {
    if (userRole === 'admin' || userRole === 'superadmin') return '/admin';
    if (userRole === 'provider') return '/provider/dashboard';
    if (userRole === 'worker') return '/worker';
    if (userRole === 'employer') return '/employer';
    return redirect;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const userRole = data.user.role;

      // Validate role: customer portal me sirf customer/admin login
      // provider portal me sirf provider login
      const roleMappings: Record<string, string[]> = {
        customer: ['customer', 'admin', 'superadmin'],
        provider: ['provider'],
        worker: ['worker'],
        employer: ['employer'],
      };

      const allowed = roleMappings[activeRole] || ['customer'];
      if (!allowed.includes(userRole)) {
        toast.error(`This account is a ${userRole}. Please use the ${userRole} login portal.`);
        setLoading(false);
        return;
      }

      dispatch(setCredentials({ user: data.user, token: data.token }));
      const isProd = window.location.protocol === 'https:';
      const sameSite = isProd ? 'None' : 'Lax';
      const secure = isProd ? 'Secure' : '';
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=${sameSite}; ${secure}`.replace(/; $/, '');

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
      router.push(resolveRoleDestination(userRole));
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

  const currentRole = roles.find(r => r.key === activeRole)!;

  return (
    <AuthCard
      title={`${currentRole.label} Login`}
      subtitle={currentRole.desc}
      footer={
        <>
          <Link href="/forgot-password" className="text-brand-orange hover:underline text-sm">
            Forgot password?
          </Link>
          <p className="mt-3 text-slate-600 text-sm">
            New here?{' '}
            <Link href={`/signup?role=${activeRole}`} className="font-semibold text-brand-orange hover:underline">
              Create {currentRole.label} account
            </Link>
          </p>
          <p className="mt-2 text-sm">
            <Link href="/otp" className="text-brand-orange hover:underline">
              Login with Mobile OTP
            </Link>
          </p>
          <p className="mt-1 text-sm">
            <Link href="/verify-email" className="text-brand-orange hover:underline">
              Login with Email OTP
            </Link>
          </p>
        </>
      }
    >
      {/* Role Tabs */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        {roles.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setActiveRole(r.key)}
            className={cn(
              'rounded-lg px-2 py-2 text-xs font-medium transition',
              activeRole === r.key
                ? 'bg-brand-navy text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

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
          {loading ? 'Signing in...' : `Sign In as ${currentRole.label}`}
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
