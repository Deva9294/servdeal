'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

export default function AdminProvidersPage() {
  const { data } = useQuery({
    queryKey: ['admin-providers'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/providers');
        return res.data.data;
      } catch {
        return [
          { _id: '1', user: { name: 'Rohit Kumar', email: 'rohit@email.com' }, verificationStatus: 'approved', rating: 4.8, completedJobs: 128 },
          { _id: '2', user: { name: 'Suresh Patel', email: 'suresh@email.com' }, verificationStatus: 'pending', rating: 0, completedJobs: 0 },
        ];
      }
    },
  });

  const approve = async (id: string) => {
    try {
      await api.patch(`/admin/providers/${id}/approve`);
    } catch { /* demo */ }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Provider Management</h1>
      <div className="space-y-3">
        {(data || []).map((p: { _id: string; user: { name: string; email: string }; verificationStatus: string; rating: number; completedJobs: number }) => (
          <Card key={p._id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="font-semibold">{p.user?.name}</p>
              <p className="text-sm text-slate-500">{p.user?.email} · ★ {p.rating} · {p.completedJobs} jobs</p>
            </div>
            <Badge status={p.verificationStatus === 'approved' ? 'active' : 'pending'}>{p.verificationStatus}</Badge>
            {p.verificationStatus === 'pending' && <Button size="sm" onClick={() => approve(p._id)}>Approve</Button>}
          </Card>
        ))}
      </div>
    </div>
  );
}
