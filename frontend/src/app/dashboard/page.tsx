'use client';

import Link from 'next/link';
import { Search, RotateCcw, MapPin, Headphones, ChevronRight, Star, Wrench } from 'lucide-react';
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
import { useState } from 'react';

const quickActions = [
  { icon: RotateCcw, label: 'Book Again', desc: 'Repeat last booking', href: '/dashboard/bookings' },
  { icon: MapPin, label: 'Track Booking', desc: 'Live on map', href: '/dashboard/bookings/track' },
  { icon: MapPin, label: 'My Addresses', desc: 'Manage locations', href: '/dashboard/addresses' },
  { icon: Headphones, label: 'Help & Support', desc: '24/7 assistance', href: '/dashboard/support' },
];

const featuredServices = [
  { slug: 'ac-repair', name: 'AC Repair', icon: 'Snowflake', color: 'bg-sky-100 text-sky-600' },
  { slug: 'electrician', name: 'Electrician', icon: 'Zap', color: 'bg-amber-100 text-amber-600' },
  { slug: 'plumbing', name: 'Plumber', icon: 'Droplets', color: 'bg-cyan-100 text-cyan-600' },
  { slug: 'car-wash', name: 'Car Wash', icon: 'Car', color: 'bg-blue-100 text-blue-600' },
  { slug: 'bike-repair', name: 'Bike Repair', icon: 'Bike', color: 'bg-violet-100 text-violet-600' },
  { slug: 'beauty-services', name: 'Beauty Services', icon: 'Sparkle', color: 'bg-pink-100 text-pink-600' },
];

const bookingTabs = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'] as const;

const offers = [
  { title: 'FLAT ₹100 OFF', code: 'AC100', desc: 'On AC Repair Services', bg: 'bg-orange-50' },
  { title: '20% OFF', code: 'PLUMB20', desc: 'On Plumbing Services', bg: 'bg-blue-50' },
];

const recommended = [
  { name: 'Electrician', slug: 'electrician', icon: 'Zap', color: 'bg-amber-100 text-amber-600', price: '₹299' },
  { name: 'AC Service', slug: 'ac-repair', icon: 'Snowflake', color: 'bg-sky-100 text-sky-600', price: '₹499' },
  { name: 'Plumber', slug: 'plumbing', icon: 'Droplets', color: 'bg-cyan-100 text-cyan-600', price: '₹349' },
  { name: 'Car Wash', slug: 'car-wash', icon: 'Car', color: 'bg-blue-100 text-blue-600', price: '₹399' },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const displayName = user?.name || 'there';
  const [activeTab, setActiveTab] = useState<string>('All');

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings', 'dashboard-recent'],
    queryFn: async () => {
      const res = await api.get('/bookings/my?limit=10');
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

  const filteredBookings = (bookings || []).filter((b: { status: string }) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return b.status === 'confirmed';
    if (activeTab === 'Ongoing') return b.status === 'ongoing';
    if (activeTab === 'Completed') return b.status === 'completed';
    if (activeTab === 'Cancelled') return b.status === 'cancelled';
    return true;
  });

  const lastCompleted = (bookings || []).find((b: { status: string }) => b.status === 'completed');

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Hero */}
        <Card className="overflow-hidden bg-gradient-to-r from-orange-50 to-white p-6 lg:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-brand-navy">Hi {displayName}, How can we help you today?</h1>
              <div className="relative mt-4 max-w-xl">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Search for a service..." className="pl-10" />
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-brand-orange/20 flex items-center justify-center">
                  <Wrench className="h-10 w-10 text-brand-orange" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">Verified</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Services */}
        <div>
          <h2 className="mb-4 font-semibold text-brand-navy">What would you like to book?</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {featuredServices.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="flex shrink-0 flex-col items-center gap-2">
                <ServiceIcon name={s.icon} className={s.color} />
                <span className="text-xs font-medium text-center">{s.name}</span>
              </Link>
            ))}
            <Link href="/services" className="flex shrink-0 flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">+</div>
              <span className="text-xs font-medium">More</span>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
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

        {/* My Bookings with Tabs */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-brand-navy">My Bookings</h2>
            <Link href="/dashboard/bookings" className="text-sm text-brand-orange">View All</Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3">
            {bookingTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-brand-orange text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {bookingsLoading ? (
              <Skeleton className="h-24" />
            ) : (
              filteredBookings.slice(0, 5).map((b: { _id: string; bookingId: string; service: { name: string }; status: string; scheduledAt: string; address: { city: string }; amount: number }) => {
                const slug = SERVICES.find((s) => b.service?.name?.includes(s.name.split(' ')[0]))?.slug || 'electrician';
                return (
                  <Link key={b._id} href={`/dashboard/bookings/${b._id}`}>
                    <Card className="flex items-center gap-4 p-4">
                      <ServiceIcon name={SERVICES.find((s) => s.slug === slug)?.icon || 'Zap'} className="bg-amber-100" />
                      <div className="flex-1">
                        <p className="font-semibold">{b.service?.name}</p>
                        <p className="text-xs text-slate-500">#{b.bookingId} · {new Date(b.scheduledAt).toLocaleString('en-IN')} · {b.address?.city}</p>
                      </div>
                      <Badge status={b.status} className="text-xs">{b.status}</Badge>
                      <p className="font-bold">{formatCurrency(b.amount)}</p>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </Card>
                  </Link>
                );
              })
            )}
            {!bookingsLoading && !filteredBookings.length && (
              <p className="text-sm text-slate-500">No {activeTab.toLowerCase()} bookings. <Link href="/services" className="text-brand-orange">Book a service</Link></p>
            )}
          </div>
        </div>

        {/* Rate Last Service */}
        {lastCompleted && (
          <Card className="p-5 bg-gradient-to-r from-amber-50 to-white">
            <h3 className="font-semibold text-brand-navy">Rate Last Service</h3>
            <p className="text-sm text-slate-500 mt-1">How was your {lastCompleted.service?.name} service?</p>
            <div className="flex gap-2 mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} className="rounded-full p-2 hover:bg-amber-100 transition">
                  <Star className="h-6 w-6 text-amber-400" />
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Recommended */}
        <div>
          <h2 className="mb-4 font-semibold text-brand-navy">Recommended for You</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((r) => (
              <Link key={r.slug} href={`/services/${r.slug}`}>
                <Card className="p-4 hover:shadow-lg transition">
                  <ServiceIcon name={r.icon} className={r.color} />
                  <p className="mt-2 font-semibold text-sm">{r.name}</p>
                  <p className="text-xs text-slate-500">Starting from {r.price}</p>
                  <Button size="sm" className="mt-3 w-full text-xs">Book Now</Button>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
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

        {/* Exclusive Offers */}
        <div>
          <h3 className="font-semibold text-brand-navy mb-3">Exclusive Offers</h3>
          <div className="space-y-3">
            {offers.map((o) => (
              <Card key={o.code} className={`p-4 ${o.bg}`}>
                <p className="font-bold text-brand-orange">{o.title}</p>
                <p className="text-xs text-slate-600 mt-1">{o.desc}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-mono bg-white px-2 py-1 rounded border">{o.code}</span>
                  <span className="text-xs text-slate-500">T&amp;C apply</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
