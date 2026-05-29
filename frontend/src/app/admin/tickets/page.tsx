'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/api';

export default function AdminTicketsPage() {
  const { data } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      try {
        const res = await api.get('/support');
        return res.data.data;
      } catch {
        return [
          { ticketId: 'TK1234', subject: 'Refund not received', status: 'open', user: { name: 'Aman' } },
          { ticketId: 'TK1233', subject: 'Provider did not arrive', status: 'in_progress', user: { name: 'Priya' } },
        ];
      }
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Support Tickets</h1>
      {(data || []).map((t: { ticketId: string; subject: string; status: string; user: { name: string } }, i: number) => (
        <Card key={i} className="flex justify-between p-4">
          <div>
            <p className="font-semibold">#{t.ticketId} — {t.subject}</p>
            <p className="text-sm text-slate-500">{t.user?.name}</p>
          </div>
          <Badge status={t.status === 'open' ? 'pending' : 'confirmed'}>{t.status}</Badge>
        </Card>
      ))}
    </div>
  );
}
