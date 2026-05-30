'use client';

import {
  LayoutDashboard, Calendar, Wallet, MapPin, Star, Tag, Bell, HelpCircle, Settings, Gift, MessageCircle, LogOut,
  Wrench, GraduationCap,
} from 'lucide-react';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Bell as BellIcon, MapPin as LocIcon } from 'lucide-react';
import { BRAND } from '@/lib/constants';
import { MobileNav } from '@/components/dashboard/MobileNav';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/dashboard/wallet', label: 'Wallet', icon: Wallet },
  { href: '/dashboard/addresses', label: 'My Addresses', icon: MapPin },
  { href: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { href: '/dashboard/offers', label: 'Offers & Coupons', icon: Tag },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageCircle },
  { href: '/tools', label: 'Tool Marketplace', icon: Wrench },
  { href: '/training', label: 'Training Center', icon: GraduationCap },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell, badge: 3 },
  { href: '/dashboard/support', label: 'Help & Support', icon: HelpCircle },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/refer', label: 'Invite & Earn', icon: Gift },
];

export default function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, logout, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) router.replace('/login?redirect=/dashboard');
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const firstLetter = user?.name?.charAt(0).toUpperCase() || 'U';
  const displayName = user?.name || 'User';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar items={navItems} />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <button className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm">
            <LocIcon className="h-4 w-4 text-brand-orange" />
            {BRAND.defaultCity}
          </button>
          <div className="flex items-center gap-4">
            <button className="relative"><BellIcon className="h-5 w-5" /><span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">3</span></button>
            <Link href="/dashboard/profile" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange text-white">{firstLetter}</div>
              <span className="text-sm font-medium">Hi, {displayName}</span>
            </Link>
            <button onClick={logout} className="rounded-lg p-2 hover:bg-slate-100" title="Logout">
              <LogOut className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </header>
        <div className="flex-1 p-6 pb-24 lg:pb-6">{children}</div>
      </div>
      <MobileNav />
    </div>
  );
}
