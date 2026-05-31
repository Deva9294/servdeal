'use client';

import {
  LayoutDashboard, Users, Wrench, Calendar, DollarSign, Star, FileText, Bell, Settings, Ticket, LogOut,
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Search, Bell as BellIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIdleTimer } from '@/hooks/useIdleTimer';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const baseNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/providers', label: 'Providers', icon: Wrench },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/cms', label: 'CMS Pages', icon: FileText },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/tickets', label: 'Support Tickets', icon: Ticket },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, isLoggedIn, isInitializing } = useAuth();
  useIdleTimer();

  const { data: stats } = useQuery({
    queryKey: ['admin-sidebar-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data.data;
    },
    staleTime: 60000,
  });

  const pendingVerifications = stats?.pendingVerifications || 0;
  const navItems = baseNavItems.map((item) =>
    item.href === '/admin/providers' && pendingVerifications > 0
      ? { ...item, badge: pendingVerifications }
      : item
  );

  useEffect(() => {
    if (!isInitializing && !isLoggedIn) router.replace('/login?redirect=/admin');
  }, [isLoggedIn, isInitializing, router]);

  if (isInitializing || !isLoggedIn) return null;

  const firstLetter = user?.name?.charAt(0).toUpperCase() || 'A';
  const displayName = user?.name || 'Admin';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar items={navItems} dark title="FIXING PROBLEMS, DELIVERING TRUST" />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b bg-white px-6 py-4">
          <h1 className="text-xl font-bold text-brand-navy">Admin Dashboard</h1>
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search here..." className="pl-10" />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative"><BellIcon className="h-5 w-5" /></button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-white">{firstLetter}</div>
              <div className="hidden text-sm md:block">
                <p className="font-semibold">{displayName}</p>
                <p className="text-xs text-slate-500">{user?.role || 'admin'}</p>
              </div>
            </div>
            <button onClick={logout} className="rounded-lg p-2 hover:bg-slate-100" title="Logout">
              <LogOut className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}
