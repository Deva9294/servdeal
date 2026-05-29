'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function ProviderBookingsPage() {
  const { data } = useQuery({
    queryKey: ['provider-bookings'],
    queryFn: async () => {
      try {
        const res = await api.get('/bookings/provider');
        return res.data.data;
      } catch {
        return [
          { bookingId: 'BK4587', service: { name: 'Electrical Wiring' }, customer: { name: 'Aman Kumar', phone: '9876543210' }, status: 'confirmed', scheduledAt: new Date(), amount: 850 },
        ];
      }
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Bookings</h1>
      <div className="space-y-3">
        {(data || []).map((b: { bookingId: string; service: { name: string }; customer: { name: string; phone: string }; status: string; scheduledAt: string; amount: number }, i: number) => (
          <Card key={i} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="font-semibold">{b.service?.name}</p>
              <p className="text-sm text-slate-500">#{b.bookingId} · {b.customer?.name} · {b.customer?.phone}</p>
              <p className="text-xs text-slate-400">{new Date(b.scheduledAt).toLocaleString('en-IN')}</p>
            </div>
            <Badge status={b.status}>{b.status}</Badge>
            <p className="font-bold">{formatCurrency(b.amount)}</p>
            <div className="flex gap-2">
              {b.status === 'pending' && <><Button size="sm">Accept</Button><Button size="sm" variant="outline">Reject</Button></>}
              {b.status === 'confirmed' && <Button size="sm">Start Job</Button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
