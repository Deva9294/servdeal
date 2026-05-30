'use client';

import Link from 'next/link';
import { Search, RotateCcw, MapPin, Headphones, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SERVICES } from '@/data/services';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

const quickActions = [
  { icon: RotateCcw, label: 'Book Again', desc: 'Repeat last booking', href: '/dashboard/bookings' },
  { icon: MapPin, label: 'Track Booking', desc: 'Live on map', href: '/dashboard/bookings/track' },
  { icon: MapPin, label: 'My Addresses', desc: 'Manage locations', href: '/dashboard/addresses' },
  { icon: Headphones, label: 'Help & Support', desc: '24/7 assistance', href: '/dashboard/support' },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const displayName = user?.name || 'there';

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', 'dashboard-recent'],
    queryFn: async () => {
      const res = await api.get('/bookings/my?limit=3');
      return res.data.data;
    },
  });

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await api.get('/payments/wallet');
      return res.data.data;
    },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card className="overflow-hidden bg-gradient-to-r from-orange-50 to-white p-8">
          <h1 className="text-2xl font-bold text-brand-navy">Hi {displayName}, How can we help you today?</h1>
          <div className="relative mt-4 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search for a service..." className="pl-10" />
          </div>
        </Card>

        <div>
          <h2 className="mb-4 font-semibold text-brand-navy">What would you like to book?</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {SERVICES.slice(0, 7).map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="flex shrink-0 flex-col items-center gap-2">
                <ServiceIcon name={s.icon} className={s.color} />
                <span className="text-xs font-medium">{s.name}</span>
              </Link>
            ))}
            <Link href="/services" className="flex shrink-0 flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">+</div>
              <span className="text-xs font-medium">More</span>
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {quickActions.map((a) => (
            <Link key={a.label} href={a.href}>
              <Card className="flex items-center gap-4 p-4 transition hover:shadow-lg">
                <a.icon className="h-8 w-8 text-brand-orange" />
                <div>
                  <p className="font-semibold">{a.label}</p>
                  <p className="text-xs text-slate-500">{a.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-brand-navy">My Bookings</h2>
            <Link href="/dashboard/bookings" className="text-sm text-brand-orange">View All</Link>
          </div>
          <div className="space-y-3">
            {bookingsLoading ? (
              <Skeleton className="h-24" />
            ) : (
              (bookings || []).map((b: { _id: string; bookingId: string; service: { name: string }; status: string; scheduledAt: string; address: { city: string }; amount: number }) => {
                const slug = SERVICES.find((s) => b.service?.name?.includes(s.name.split(' ')[0]))?.slug || 'electrician';
                return (
                  <Link key={b._id} href={`/dashboard/bookings/${b._id}`}>
                    <Card className="flex items-center gap-4 p-4">
                      <ServiceIcon name={SERVICES.find((s) => s.slug === slug)?.icon || 'Zap'} className="bg-amber-100" />
                      <div className="flex-1">
                        <p className="font-semibold">{b.service?.name}</p>
                        <p className="text-xs text-slate-500">#{b.bookingId} · {new Date(b.scheduledAt).toLocaleString('en-IN')} · {b.address?.city}</p>
                      </div>
                      <Badge status={b.status}>{b.status}</Badge>
                      <p className="font-bold">{formatCurrency(b.amount)}</p>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </Card>
                  </Link>
                );
              })
            )}
            {!bookingsLoading && !bookings?.length && (
              <p className="text-sm text-slate-500">No bookings yet. <Link href="/services" className="text-brand-orange">Book a service</Link></p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-5">
          <p className="text-sm text-slate-500">My Wallet</p>
          <p className="text-2xl font-bold text-brand-navy">{formatCurrency(wallet?.balance || 0)}</p>
          <Link href="/dashboard/wallet"><Button className="mt-4 w-full" size="sm">Add Money</Button></Link>
        </Card>
        <Card className="bg-brand-navy p-5 text-white">
          <p className="font-semibold">Need Help?</p>
          <p className="mt-1 text-sm text-white/70">Our support team is here 24/7</p>
          <Link href="/dashboard/support"><Button variant="secondary" className="mt-4 w-full border-white text-white" size="sm">Contact Support</Button></Link>
        </Card>
        <Card className="border-dashed border-brand-orange p-4">
          <p className="font-semibold text-brand-orange">FLAT ₹100 OFF</p>
          <p className="text-xs text-slate-500">Code: WELCOME100</p>
        </Card>
      </div>
    </div>
  );
}
