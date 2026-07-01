'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { TrackingMap } from '@/components/maps/TrackingMap';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/api';

function TrackContent() {
  const params = useSearchParams();
  const id = params.get('id');

  const { data: tracking, isLoading } = useQuery({
    queryKey: ['booking-tracking', id],
    queryFn: async () => {
      const res = await api.get(`/bookings/${id}/tracking`);
      return res.data.data;
    },
    enabled: Boolean(id),
    refetchInterval: 5000,
  });

  if (!id) return <p className="text-sm text-slate-500">Booking ID missing.</p>;
  if (isLoading) return <p className="text-sm text-slate-500">Loading live tracking...</p>;

  const customerCenter = tracking?.address?.lat && tracking?.address?.lng
    ? [tracking.address.lat, tracking.address.lng] as [number, number]
    : [25.5941, 85.1376] as [number, number];
  const providerPos = tracking?.providerLocation
    ? [tracking.providerLocation.lat, tracking.providerLocation.lng] as [number, number]
    : undefined;

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-semibold">Booking #{tracking?.bookingId}</p>
          <p className="text-sm text-slate-500">{tracking?.provider?.shopName || tracking?.provider?.fullName}</p>
        </div>
        <Badge status={tracking?.status || 'pending'}>{tracking?.status || 'pending'}</Badge>
      </div>
      <TrackingMap center={customerCenter} providerPosition={providerPos} height="450px" />
      <p className="mt-4 text-center text-sm text-slate-500">
        {providerPos ? 'Provider location updating every few seconds' : 'Waiting for provider location...'}
      </p>
    </Card>
  );
}

export default function TrackBookingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Live Booking Tracking</h1>
        <p className="text-slate-500">Track your provider in real-time on OpenStreetMap</p>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <TrackContent />
      </Suspense>
    </div>
  );
}
