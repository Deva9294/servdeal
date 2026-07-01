'use client';

import {
  LayoutDashboard, User, Calendar, Wallet, Settings, LogOut,
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Bell as BellIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/provider', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/provider/bookings', label: 'Bookings', icon: Calendar },
  { href: '/provider/profile', label: 'Profile & KYC', icon: User },
  { href: '/provider/earnings', label: 'Earnings', icon: Wallet },
  { href: '/provider/settings', label: 'Settings', icon: Settings },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, isLoggedIn, isInitializing } = useAuth();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!isInitializing && !isLoggedIn) router.replace('/login?redirect=/provider');
  }, [isLoggedIn, isInitializing, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    api.get('/providers/me')
      .then(({ data }) => setIsOnline(Boolean(data.data?.isOnline)))
      .catch(() => undefined);
  }, [isLoggedIn]);

  const toggleOnline = async () => {
    try {
      const { data } = await api.patch('/providers/online');
      setIsOnline(Boolean(data.data?.isOnline));
      toast.success(data.data?.isOnline ? 'You are now online' : 'You are offline');
    } catch {
      toast.error('Could not update availability');
    }
  };

  if (isInitializing || !isLoggedIn) return null;

  const displayName = user?.name || 'Provider';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        items={navItems}
        dark
        title="FIXING PROBLEMS, DELIVERING TRUST"
        profile={{
          name: displayName,
          role: 'Service Provider',
          avatar: user?.avatar,
          isOnline,
        }}
      />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-brand-navy">Provider Panel</h1>
            <p className="text-sm text-slate-500">Welcome back, {displayName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 hover:bg-slate-100">
              <BellIcon className="h-5 w-5" />
            </button>
            <Button variant={isOnline ? 'secondary' : 'outline'} size="sm" onClick={toggleOnline}>
              {isOnline ? 'Go Offline' : 'Go Online'}
            </Button>
            <button onClick={logout} className="rounded-lg p-2 hover:bg-slate-100" title="Logout">
              <LogOut className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
