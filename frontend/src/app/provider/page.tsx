'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Calendar, CheckCircle, Clock, Wallet, ChevronRight, MapPin, Car, TrendingUp, Star, Award } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Link from 'next/link';
import {
  AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip,
} from 'recharts';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import { SERVICES } from '@/data/services';

const myServices = SERVICES.filter((s) => ['electrician', 'ac-repair', 'fan-repair', 'washing-machine-repair', 'inverter-repair'].includes(s.slug));

function generateEarningsData(total: number) {
  const days = ['1 May', '6 May', '11 May', '16 May', '21 May', '26 May', '31 May'];
  const base = total / 7;
  return days.map((day, i) => ({
    day,
    amount: Math.max(100, Math.round(base * (0.5 + Math.sin(i * 0.8) * 0.5 + i * 0.15))),
  }));
}

export default function ProviderDashboard() {
  const qc = useQueryClient();
  const [locLoading, setLocLoading] = useState(false);
  const { data: profile } = useQuery({
    queryKey: ['provider-profile'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data.user;
    },
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['provider-bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/provider');
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

  const updateLocation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        api.patch('/users/me', {
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        }).then(() => {
          toast.success('Live location updated');
          qc.invalidateQueries({ queryKey: ['provider-profile'] });
        }).catch(() => {
          toast.error('Failed to update location');
        }).finally(() => setLocLoading(false));
      },
      () => {
        toast.error('Could not get location');
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const totalBookings = bookings?.length || 0;
  const completed = bookings?.filter((b: { status: string }) => b.status === 'completed').length || 0;
  const pending = bookings?.filter((b: { status: string }) => b.status === 'pending' || b.status === 'confirmed').length || 0;
  const earnings = wallet?.balance || 0;
  const earningsData = generateEarningsData(earnings);
  const upcomingBookings = (bookings || []).filter((b: { status: string }) => b.status === 'confirmed' || b.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Bookings', value: String(totalBookings), sub: 'This Month', trend: '+18%', icon: Calendar, color: 'bg-blue-50 text-blue-600' },
          { label: 'Completed Bookings', value: String(completed), sub: 'This Month', trend: '+20%', icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Pending Bookings', value: String(pending), sub: 'Today', trend: null, icon: Clock, color: 'bg-orange-50 text-orange-600' },
          { label: 'Total Earnings', value: formatCurrency(earnings), sub: 'This Month', trend: '+15%', icon: Wallet, color: 'bg-purple-50 text-purple-600' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-brand-navy">{stat.value}</p>
                {stat.trend ? (
                  <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> {stat.trend} <span className="text-slate-400">from last month</span>
                  </p>
                ) : (
                  <Link href="/provider/bookings" className="mt-1 text-xs text-brand-orange inline-block">View all bookings</Link>
                )}
              </div>
              <div className={`rounded-full p-3 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Location Card */}
      <Card className="flex items-center gap-4 bg-brand-navy p-5 text-white">
        <div className="rounded-full bg-brand-orange p-3">
          <Car className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold">My Live Location</p>
          {profile?.location?.lat ? (
            <p className="text-sm text-white/70">
              Lat: {profile.location.lat.toFixed(5)}, Lng: {profile.location.lng.toFixed(5)}
            </p>
          ) : (
            <p className="text-sm text-white/70">Location not set — update to show on customer map</p>
          )}
        </div>
        <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/20" onClick={updateLocation} disabled={locLoading}>
          <MapPin className="h-4 w-4 mr-1" />
          {locLoading ? 'Updating...' : 'Update'}
        </Button>
      </Card>

      {/* Earnings + Upcoming Bookings */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-navy">Earnings Overview</h3>
            <span className="text-xs text-slate-500 border rounded-lg px-2 py-1">This Month</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff7a00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip formatter={(value) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, 'Earnings']} />
                <Area type="monotone" dataKey="amount" stroke="#ff7a00" strokeWidth={2} fill="url(#earnGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4 text-sm">
            <div>
              <p className="text-xs text-slate-500">Total Earnings</p>
              <p className="font-bold text-brand-navy">{formatCurrency(earnings)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Service Charges</p>
              <p className="font-bold text-brand-navy">{formatCurrency(Math.round(earnings * 0.1))}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Net Earnings</p>
              <p className="font-bold text-green-600">{formatCurrency(Math.round(earnings * 0.9))}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-navy">Upcoming Bookings</h3>
            <Link href="/provider/bookings" className="text-sm text-brand-orange">View All</Link>
          </div>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <Skeleton className="h-16" />
            ) : (
              upcomingBookings.slice(0, 5).map((b: { _id: string; service: { name: string }; customer: { name: string }; address: { city: string }; status: string; scheduledAt: string }, i: number) => (
                <Link key={b._id || i} href="/provider/bookings">
                  <div className="flex items-center gap-3 rounded-xl border p-3 hover:bg-slate-50 transition cursor-pointer">
                    <div className="text-center min-w-[50px]">
                      <p className="text-xs font-bold text-brand-orange">{new Date(b.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{b.service?.name}</p>
                      <p className="text-xs text-slate-500">{b.customer?.name} · {b.address?.city}</p>
                    </div>
                    <Badge status={b.status} className="text-xs">{b.status}</Badge>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </Link>
              ))
            )}
            {!isLoading && !upcomingBookings.length && (
              <p className="text-sm text-slate-500">No upcoming bookings.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Service Performance + My Services */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold text-brand-navy">Service Performance</h3>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="#22c55e" strokeWidth="8" fill="none" strokeDasharray={`${4.8 / 5 * 264} 264`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-brand-navy">4.8</span>
                <span className="text-[10px] text-slate-500">out of 5</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-brand-orange text-brand-orange" />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1">(245 Reviews)</p>
              <Link href="/provider/reviews" className="mt-2 inline-block text-sm text-brand-orange">View All Reviews</Link>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {[
              { stars: 5, count: 180 },
              { stars: 4, count: 45 },
              { stars: 3, count: 15 },
              { stars: 2, count: 3 },
              { stars: 1, count: 2 },
            ].map((r) => (
              <div key={r.stars} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-right text-slate-600">{r.stars} Star</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${(r.count / 245) * 100}%` }} />
                </div>
                <span className="w-6 text-slate-500">{r.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-brand-navy">My Services</h3>
            <Link href="/provider/services" className="text-sm text-brand-orange">Manage Services</Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {myServices.map((s) => (
              <div key={s.slug} className="flex items-center justify-between rounded-xl border p-3">
                <div className="flex items-center gap-3">
                  <ServiceIcon name={s.icon} className={s.color} />
                  <span className="font-medium text-sm">{s.name}</span>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-green-500 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Banner */}
      <Card className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-brand-orange p-3">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-brand-navy">Become a Top Rated Provider</p>
            <p className="text-sm text-slate-600">Complete more bookings and get 5 star reviews to unlock more benefits.</p>
          </div>
        </div>
        <Button className="bg-brand-orange hover:bg-brand-orange/90">Know More</Button>
      </Card>
    </div>
  );
}
