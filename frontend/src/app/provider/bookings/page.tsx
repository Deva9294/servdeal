'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

interface Booking {
  _id: string;
  bookingId: string;
  service?: { name: string };
  customer?: { name: string; phone: string };
  status: string;
  scheduledAt: string;
  estimatedAmount: number;
  paymentStatus?: string;
  address?: { line1?: string; city?: string };
}

export default function ProviderBookingsPage() {
  const qc = useQueryClient();
  const locationWatchRef = useRef<number | null>(null);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['provider-bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/provider');
      return res.data.data as Booking[];
    },
  });

  const stopTracking = () => {
    if (locationWatchRef.current != null) {
      navigator.geolocation.clearWatch(locationWatchRef.current);
      locationWatchRef.current = null;
    }
    setActiveTrackingId(null);
  };

  const startLocationTracking = (bookingId: string) => {
    if (!navigator.geolocation) return;
    stopTracking();
    setActiveTrackingId(bookingId);
    locationWatchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        api.patch(`/bookings/${bookingId}/location`, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }).catch(() => undefined);
      },
      () => toast.error('Could not share live location'),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  };

  useEffect(() => () => stopTracking(), []);

  const acceptMutation = useMutation({
    mutationFn: (id: string) => api.post(`/bookings/${id}/accept`),
    onSuccess: () => {
      toast.success('Booking accepted');
      qc.invalidateQueries({ queryKey: ['provider-bookings'] });
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to accept');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.post(`/bookings/${id}/reject`),
    onSuccess: () => {
      toast.success('Booking rejected');
      qc.invalidateQueries({ queryKey: ['provider-bookings'] });
    },
  });

  const startMutation = useMutation({
    mutationFn: (id: string) =>
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const res = await api.post(`/bookings/${id}/start`, {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              });
              resolve(res);
            } catch (err) {
              reject(err);
            }
          },
          () => reject(new Error('Enable GPS to start job')),
          { enableHighAccuracy: true }
        );
      }),
    onSuccess: (_res, id) => {
      toast.success('Job started. Customer can track your live location.');
      startLocationTracking(String(id));
      qc.invalidateQueries({ queryKey: ['provider-bookings'] });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to start job';
      toast.error(msg);
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => api.post(`/bookings/${id}/complete`),
    onSuccess: (_res, id) => {
      toast.success('Service marked complete');
      if (activeTrackingId === id) stopTracking();
      qc.invalidateQueries({ queryKey: ['provider-bookings'] });
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to complete');
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Bookings</h1>
      {isLoading && <p className="text-sm text-slate-500">Loading...</p>}
      {!isLoading && !bookings?.length && <p className="text-sm text-slate-500">No bookings yet.</p>}
      <div className="space-y-3">
        {(bookings || []).map((b) => (
          <Card key={b._id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="flex-1 min-w-[200px]">
              <p className="font-semibold">{b.service?.name || 'Service'}</p>
              <p className="text-sm text-slate-500">
                #{b.bookingId} · {b.customer?.name || 'Customer'} · {b.customer?.phone || ''}
              </p>
              <p className="text-xs text-slate-400">{new Date(b.scheduledAt).toLocaleString('en-IN')}</p>
              <p className="text-xs text-slate-400">{b.address?.line1}, {b.address?.city}</p>
            </div>
            <Badge status={b.status}>{b.status}</Badge>
            <p className="font-bold">{formatCurrency(b.estimatedAmount)}</p>
            <div className="flex flex-wrap gap-2 items-center">
              {b.status === 'pending' && (
                <>
                  <Button size="sm" onClick={() => acceptMutation.mutate(b._id)} disabled={acceptMutation.isPending}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => rejectMutation.mutate(b._id)}>
                    Reject
                  </Button>
                </>
              )}
              {b.status === 'upcoming' && (
                <Button size="sm" onClick={() => startMutation.mutate(b._id)} disabled={startMutation.isPending}>
                  Start & Go to Customer
                </Button>
              )}
              {b.status === 'in_progress' && (
                <>
                  <span className="text-xs text-green-600">Live location sharing</span>
                  <Button size="sm" onClick={() => completeMutation.mutate(b._id)} disabled={completeMutation.isPending}>
                    Mark Complete
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
