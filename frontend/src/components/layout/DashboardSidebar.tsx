'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export type NavItem = { href: string; label: string; icon: LucideIcon; badge?: number };

export function DashboardSidebar({
  items,
  title,
  dark = false,
}: {
  items: NavItem[];
  title?: string;
  dark?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex w-64 flex-col border-r',
        dark ? 'bg-brand-navy text-white border-white/10' : 'bg-white border-slate-200'
      )}
    >
      <div className="p-4">
        <Logo />
        {title && <p className="mt-2 text-xs text-white/60">{title}</p>}
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                dark
                  ? active
                    ? 'bg-brand-orange/20 text-brand-orange'
                    : 'text-white/70 hover:bg-white/10'
                  : active
                    ? 'bg-orange-50 text-brand-orange'
                    : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
              {item.badge ? (
                <span className="ml-auto rounded-full bg-brand-orange px-2 py-0.5 text-xs text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
