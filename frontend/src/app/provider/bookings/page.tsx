'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
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
  amount: number;
}

export default function ProviderBookingsPage() {
  const qc = useQueryClient();
  const [otpMap, setOtpMap] = useState<Record<string, string>>({});

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['provider-bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/provider');
      return res.data.data as Booking[];
    },
  });

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
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to reject');
    },
  });

  const startMutation = useMutation({
    mutationFn: (id: string) => api.post(`/bookings/${id}/start`),
    onSuccess: (res) => {
      toast.success(`Start OTP: ${res.data.data.otp} (shared with customer)`);
      qc.invalidateQueries({ queryKey: ['provider-bookings'] });
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to start');
    },
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, otp }: { id: string; otp: string }) => api.post(`/bookings/${id}/complete`, { otp }),
    onSuccess: () => {
      toast.success('Job completed! Earnings credited.');
      qc.invalidateQueries({ queryKey: ['provider-bookings'] });
      qc.invalidateQueries({ queryKey: ['wallet'] });
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to complete');
    },
  });

  const handleOtpChange = (id: string, val: string) => {
    setOtpMap((prev) => ({ ...prev, [id]: val }));
  };

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
              <p className="text-sm text-slate-500">#{b.bookingId} · {b.customer?.name || 'Customer'} · {b.customer?.phone || ''}</p>
              <p className="text-xs text-slate-400">{new Date(b.scheduledAt).toLocaleString('en-IN')}</p>
            </div>
            <Badge status={b.status}>{b.status}</Badge>
            <p className="font-bold">{formatCurrency(b.amount)}</p>
            <div className="flex flex-wrap gap-2 items-center">
              {b.status === 'pending' && (
                <>
                  <Button size="sm" onClick={() => acceptMutation.mutate(b._id)} disabled={acceptMutation.isPending}>
                    {acceptMutation.isPending ? '...' : 'Accept'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => rejectMutation.mutate(b._id)} disabled={rejectMutation.isPending}>
                    {rejectMutation.isPending ? '...' : 'Reject'}
                  </Button>
                </>
              )}
              {b.status === 'confirmed' && (
                <Button size="sm" onClick={() => startMutation.mutate(b._id)} disabled={startMutation.isPending}>
                  {startMutation.isPending ? '...' : 'Start Job'}
                </Button>
              )}
              {b.status === 'ongoing' && (
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Enter OTP"
                    className="w-28 h-8 text-sm"
                    value={otpMap[b._id] || ''}
                    onChange={(e) => handleOtpChange(b._id, e.target.value)}
                  />
                  <Button size="sm" onClick={() => completeMutation.mutate({ id: b._id, otp: otpMap[b._id] || '' })} disabled={completeMutation.isPending}>
                    {completeMutation.isPending ? '...' : 'Complete'}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
