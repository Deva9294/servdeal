'use client';

import {
  LayoutDashboard, User, Briefcase, Wallet, Star, Clock, Bell, Settings, LogOut, Wrench,
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Bell as BellIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIdleTimer } from '@/hooks/useIdleTimer';

const navItems = [
  { href: '/worker', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/worker/profile', label: 'My Profile', icon: User },
  { href: '/worker/jobs', label: 'Find Jobs', icon: Briefcase },
  { href: '/worker/bookings', label: 'My Bookings', icon: Wrench },
  { href: '/worker/earnings', label: 'Earnings', icon: Wallet },
  { href: '/worker/reviews', label: 'Reviews', icon: Star },
  { href: '/worker/availability', label: 'Availability', icon: Clock },
  { href: '/worker/notifications', label: 'Notifications', icon: Bell },
  { href: '/worker/settings', label: 'Settings', icon: Settings },
];

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, isLoggedIn, isInitializing } = useAuth();
  useIdleTimer();

  useEffect(() => {
    if (!isInitializing && !isLoggedIn) router.replace('/login?redirect=/worker');
  }, [isLoggedIn, isInitializing, router]);

  if (isInitializing || !isLoggedIn) return null;

  const displayName = user?.name || 'Worker';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar
        items={navItems}
        dark
        title="FIXING PROBLEMS, DELIVERING TRUST"
        profile={{
          name: displayName,
          role: 'Skilled Worker',
          avatar: user?.avatar,
          isOnline: true,
        }}
      />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-brand-navy">Worker Panel</h1>
            <p className="text-sm text-slate-500">Welcome back, {displayName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 hover:bg-slate-100">
              <BellIcon className="h-5 w-5" />
            </button>
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="h-9 w-9 rounded-full object-cover border border-brand-orange/30" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange text-white font-medium">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
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
