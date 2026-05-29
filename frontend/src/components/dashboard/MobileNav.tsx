'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Wallet, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/dashboard/book', icon: Plus, label: 'Book', center: true },
  { href: '/dashboard/wallet', icon: Wallet, label: 'Wallet' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white px-2 py-2 lg:hidden">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const active = pathname === item.href;
          if (item.center) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-white shadow-lg"
              >
                <item.icon className="h-6 w-6" />
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('flex flex-col items-center gap-0.5 text-xs', active ? 'text-brand-orange' : 'text-slate-500')}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
