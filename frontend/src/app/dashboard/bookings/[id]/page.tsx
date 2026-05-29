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
import { CheckCircle, Circle, MessageCircle } from 'lucide-react';

const timeline = [
  { status: 'pending', label: 'Booking Placed' },
  { status: 'confirmed', label: 'Provider Assigned' },
  { status: 'ongoing', label: 'Service In Progress' },
  { status: 'completed', label: 'Completed' },
];

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: booking } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        return res.data.data;
      } catch {
        return {
          bookingId: 'BK4587',
          status: 'confirmed',
          amount: 850,
          service: { name: 'Electrical Wiring Repair' },
          scheduledAt: new Date().toISOString(),
          address: { line1: '123 MG Road', city: 'Patna' },
        };
      }
    },
  });

  if (!booking) return <div>Loading...</div>;

  const currentIdx = timeline.findIndex((t) => t.status === booking.status);

  return (
    <div className="space-y-6">
      <PageHeader title={`Booking #${booking.bookingId}`} description={booking.service?.name} />

      <div className="flex flex-wrap items-center gap-4">
        <Badge status={booking.status}>{booking.status}</Badge>
        <span className="text-xl font-bold">{formatCurrency(booking.amount)}</span>
        <Link href="/dashboard/chat"><Button variant="outline" size="sm"><MessageCircle className="h-4 w-4" /> Chat</Button></Link>
        {['confirmed', 'ongoing'].includes(booking.status) && (
          <Link href="/dashboard/bookings/track"><Button size="sm">Live Track</Button></Link>
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
        <p className="text-sm text-slate-500">Scheduled</p>
        <p className="font-medium">{new Date(booking.scheduledAt).toLocaleString('en-IN')}</p>
        <p className="mt-2 text-sm text-slate-500">Address</p>
        <p className="font-medium">{booking.address?.line1}, {booking.address?.city}</p>
      </Card>

      {['confirmed', 'ongoing'].includes(booking.status) && (
        <TrackingMap center={[25.5941, 85.1376]} providerPosition={[25.6, 85.15]} />
      )}
    </div>
  );
}
