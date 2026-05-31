'use client';

import {
  LayoutDashboard, User, Wrench, Calendar, Wallet, Star, Clock, Bell, Settings, LogOut,
  Award, Briefcase, Zap, Users, AlertTriangle, Sparkles,
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Bell as BellIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIdleTimer } from '@/hooks/useIdleTimer';

const navItems = [
  { href: '/provider', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/provider/profile', label: 'My Profile', icon: User },
  { href: '/provider/services', label: 'My Services', icon: Wrench },
  { href: '/provider/bookings', label: 'Bookings', icon: Calendar },
  { href: '/provider/earnings', label: 'Earnings', icon: Wallet },
  { href: '/provider/reviews', label: 'Reviews', icon: Star },
  { href: '/provider/availability', label: 'My Availability', icon: Clock },
  { href: '/provider/badges', label: 'Badges', icon: Award },
  { href: '/provider/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/provider/alerts', label: 'Job Alerts', icon: AlertTriangle },
  { href: '/provider/matching', label: 'AI Matching', icon: Sparkles },
  { href: '/provider/emergency', label: 'Emergency Mode', icon: Zap },
  { href: '/provider/team', label: 'My Team', icon: Users },
  { href: '/provider/notifications', label: 'Notifications', icon: Bell },
  { href: '/provider/settings', label: 'Settings', icon: Settings },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, isLoggedIn, isInitializing } = useAuth();
  useIdleTimer();

  useEffect(() => {
    if (!isInitializing && !isLoggedIn) router.replace('/login?redirect=/provider');
  }, [isLoggedIn, isInitializing, router]);

  if (isInitializing || !isLoggedIn) return null;

  const displayName = user?.name || 'Provider';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar items={navItems} dark title="FIXING PROBLEMS, DELIVERING TRUST" />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-brand-navy">Provider Panel</h1>
            <p className="text-sm text-slate-500">Welcome, {displayName}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 hover:bg-slate-100">
              <BellIcon className="h-5 w-5" />
            </button>
            <Button variant="secondary" size="sm">Go Offline</Button>
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
