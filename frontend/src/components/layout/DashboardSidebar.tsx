'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { cn } from '@/lib/utils';
import { LucideIcon, Star } from 'lucide-react';

export type NavItem = { href: string; label: string; icon: LucideIcon; badge?: number };

export type SidebarProfile = {
  name?: string;
  role?: string;
  avatar?: string;
  rating?: number;
  isOnline?: boolean;
};

export function DashboardSidebar({
  items,
  title,
  dark = false,
  profile,
}: {
  items: NavItem[];
  title?: string;
  dark?: boolean;
  profile?: SidebarProfile;
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
        <Logo monochrome={dark} />
        {title && <p className="mt-2 text-xs text-white/60">{title}</p>}
      </div>

      {profile && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-white font-bold text-lg">
                  {(profile.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              {profile.isOnline !== undefined && (
                <span
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2',
                    dark ? 'border-brand-navy' : 'border-white',
                    profile.isOnline ? 'bg-green-500' : 'bg-slate-400'
                  )}
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{profile.name || 'User'}</p>
              {profile.role && <p className="text-xs text-slate-400 truncate">{profile.role}</p>}
              {profile.rating !== undefined && profile.rating > 0 && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs">{profile.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
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
