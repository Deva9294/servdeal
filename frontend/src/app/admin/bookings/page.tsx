'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';

export default function AdminBookingsPage() {
  const { data } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/bookings');
        return res.data.data;
      } catch {
        return [
          { bookingId: 'BK4587', service: { name: 'Electrical' }, customer: { name: 'Aman' }, status: 'confirmed', amount: 850 },
        ];
      }
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Booking Management</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50"><th className="p-3 text-left">ID</th><th>Service</th><th>Customer</th><th>Status</th><th>Amount</th></tr></thead>
          <tbody>
            {(data || []).map((b: { bookingId: string; service: { name: string }; customer: { name: string }; status: string; amount: number }, i: number) => (
              <tr key={i} className="border-b">
                <td className="p-3">#{b.bookingId}</td>
                <td>{b.service?.name}</td>
                <td>{b.customer?.name}</td>
                <td><Badge status={b.status}>{b.status}</Badge></td>
                <td className="font-semibold">{formatCurrency(b.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
