'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TrackingMap } from '@/components/maps/TrackingMap';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { CheckCircle, Circle } from 'lucide-react';

const timeline = [
  { status: 'pending', label: 'Booking Placed' },
  { status: 'upcoming', label: 'Provider Accepted' },
  { status: 'in_progress', label: 'Provider En Route' },
  { status: 'completed', label: 'Service Completed' },
];

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const res = await api.get(`/bookings/${id}`);
      return res.data.data;
    },
    refetchInterval: 15000,
  });

  const { data: tracking } = useQuery({
    queryKey: ['booking-tracking', id],
    queryFn: async () => {
      const res = await api.get(`/bookings/${id}/tracking`);
      return res.data.data;
    },
    enabled: Boolean(booking && ['upcoming', 'in_progress'].includes(booking.status)),
    refetchInterval: 5000,
  });

  if (isLoading || !booking) return <div className="p-8 text-center text-slate-500">Loading booking...</div>;

  const currentIdx = timeline.findIndex((t) => t.status === booking.status);
  const providerPos = tracking?.providerLocation
    ? [tracking.providerLocation.lat, tracking.providerLocation.lng] as [number, number]
    : undefined;
  const customerCenter = booking.address?.lat && booking.address?.lng
    ? [booking.address.lat, booking.address.lng] as [number, number]
    : [25.5941, 85.1376] as [number, number];

  return (
    <div className="space-y-6">
      <PageHeader title={`Booking #${booking.bookingId}`} description={booking.service?.name} />

      <div className="flex flex-wrap items-center gap-4">
        <Badge status={booking.status}>{booking.status}</Badge>
        <span className="text-xl font-bold">{formatCurrency(booking.estimatedAmount || booking.finalAmount)}</span>
        {['upcoming', 'in_progress'].includes(booking.status) && (
          <Link href={`/dashboard/bookings/track?id=${booking._id}`}>
            <Button size="sm">Live Track</Button>
          </Link>
        )}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Booking Timeline</h3>
        <div className="space-y-4">
          {timeline.map((step, i) => (
            <div key={step.status} className="flex items-center gap-3">
              {i <= currentIdx ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Circle className="h-6 w-6 text-slate-300" />
              )}
              <span className={i <= currentIdx ? 'font-medium' : 'text-slate-400'}>{step.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <p className="text-sm text-slate-500">Provider</p>
        <p className="font-medium">{booking.provider?.shopName || booking.provider?.fullName || 'Assigned provider'}</p>
        <p className="mt-2 text-sm text-slate-500">Scheduled</p>
        <p className="font-medium">{new Date(booking.scheduledAt).toLocaleString('en-IN')}</p>
        <p className="mt-2 text-sm text-slate-500">Address</p>
        <p className="font-medium">{booking.address?.line1}, {booking.address?.city}</p>
      </Card>

      {['upcoming', 'in_progress'].includes(booking.status) && (
        <TrackingMap center={customerCenter} providerPosition={providerPos} height="450px" />
      )}
    </div>
  );
}
