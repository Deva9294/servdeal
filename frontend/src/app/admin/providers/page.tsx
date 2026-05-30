'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminProvidersPage() {
  const qc = useQueryClient();
  const { data: providers, isLoading } = useQuery({
    queryKey: ['admin-providers'],
    queryFn: async () => {
      const res = await api.get('/admin/providers');
      return res.data.data;
    },
  });

  const approve = async (id: string) => {
    try {
      await api.patch(`/admin/providers/${id}/approve`);
      toast.success('Provider approved');
      qc.invalidateQueries({ queryKey: ['admin-providers'] });
    } catch {
      toast.error('Approval failed');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Provider Management</h1>
      {isLoading && <Skeleton className="h-24" />}
      {!isLoading && !providers?.length && <p className="text-sm text-slate-500">No providers found.</p>}
      <div className="space-y-3">
        {(providers || []).map((p: { _id: string; user: { name: string; email: string }; verificationStatus: string; rating: number; completedJobs: number }) => (
          <Card key={p._id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div>
              <p className="font-semibold">{p.user?.name}</p>
              <p className="text-sm text-slate-500">{p.user?.email} · ★ {p.rating || 0} · {p.completedJobs || 0} jobs</p>
            </div>
            <Badge status={p.verificationStatus === 'approved' ? 'active' : 'pending'}>{p.verificationStatus}</Badge>
            {p.verificationStatus === 'pending' && <Button size="sm" onClick={() => approve(p._id)}>Approve</Button>}
          </Card>
        ))}
      </div>
    </div>
  );
}
