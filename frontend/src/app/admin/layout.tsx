'use client';

import {
  LayoutDashboard, Users, Wrench, Calendar, DollarSign, Star, FileText, Bell, Settings, Ticket,
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { Input } from '@/components/ui/Input';
import { Search, Bell as BellIcon } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/providers', label: 'Providers', icon: Wrench },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/cms', label: 'CMS Pages', icon: FileText },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell, badge: 12 },
  { href: '/admin/tickets', label: 'Support Tickets', icon: Ticket, badge: 5 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
            <button className="relative"><BellIcon className="h-5 w-5" /><span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">6</span></button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy text-white">A</div>
              <div className="hidden text-sm md:block">
                <p className="font-semibold">Admin</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}
