'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Calendar, CheckCircle, Clock, Wallet, ChevronRight, MapPin, Car } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { useState } from 'react';

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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Bookings', value: String(totalBookings), change: 'All time', icon: Calendar, color: 'text-blue-600 bg-blue-100' },
          { label: 'Completed', value: String(completed), change: 'Done', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
          { label: 'Pending', value: String(pending), change: 'View all', icon: Clock, color: 'text-orange-600 bg-orange-100' },
          { label: 'Wallet Balance', value: formatCurrency(earnings), change: 'Available', icon: Wallet, color: 'text-purple-600 bg-purple-100' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-green-600">{stat.change}</p>
              </div>
              <div className={`rounded-xl p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold text-brand-navy">Earnings Overview</h3>
          <div className="mt-4 h-64 flex items-center justify-center text-slate-400 text-sm">
            Earnings chart coming soon
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 text-sm">
            <span>Total: {formatCurrency(earnings)}</span>
            <span className="font-semibold text-green-600">Net: {formatCurrency(earnings)}</span>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-brand-navy">Upcoming Bookings</h3>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              <Skeleton className="h-16" />
            ) : (
              (bookings || []).filter((b: { status: string }) => b.status === 'confirmed' || b.status === 'pending').slice(0, 5).map((b: { _id: string; service: { name: string }; customer: { name: string }; address: { city: string }; status: string; scheduledAt: string }, i: number) => (
                <div key={b._id || i} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="text-center">
                    <p className="text-xs font-bold text-brand-orange">{new Date(b.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{b.service?.name}</p>
                    <p className="text-xs text-slate-500">{b.customer?.name} · {b.address?.city}</p>
                  </div>
                  <Badge status={b.status}>{b.status}</Badge>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </div>
              ))
            )}
            {!isLoading && !(bookings || []).filter((b: { status: string }) => b.status === 'confirmed' || b.status === 'pending').length && (
              <p className="text-sm text-slate-500">No upcoming bookings.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-brand-navy">My Services</h3>
        <p className="mt-4 text-sm text-slate-500">Manage your offered services from the provider profile.</p>
        <Button variant="outline" className="mt-4">+ Add New Service</Button>
      </Card>

      <Card className="flex items-center justify-between bg-orange-50 p-6">
        <div>
          <p className="font-bold text-brand-navy">Become a Top Rated Provider</p>
          <p className="text-sm text-slate-600">Complete more bookings and earn 5-star reviews</p>
        </div>
        <Button>Know More</Button>
      </Card>
    </div>
  );
}
