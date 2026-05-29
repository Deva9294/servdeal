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

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const isProvider = searchParams.get('role') === 'provider';

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        ...form,
        role: isProvider ? 'provider' : 'customer',
      });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success('Account created successfully!');
      router.push(isProvider ? '/provider' : '/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title={isProvider ? 'Register as Provider' : 'Create Account'}
      subtitle={isProvider ? 'Start earning with ServDeal after verification' : 'Book trusted home services in minutes'}
      footer={
        <p className="text-slate-600">
          Already have an account?{' '}
          <Link href={`/login${isProvider ? '?role=provider' : ''}`} className="font-semibold text-brand-orange hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
          <Input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <Input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
        </div>
        <p className="text-xs text-slate-500">
          By signing up you agree to our{' '}
          <Link href="/terms" className="text-brand-orange hover:underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-brand-orange hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>
    </AuthCard>
  );
}

export default function SignupPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<div className="py-20 text-center text-slate-600">Loading...</div>}>
        <SignupForm />
      </Suspense>
    </PublicLayout>
  );
}
