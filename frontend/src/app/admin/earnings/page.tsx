'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminEarningsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data.data;
    },
  });

  const totalEarnings = stats?.totalEarnings || 0;
  const commission = Math.round(totalEarnings * 0.15);
  const payouts = totalEarnings - commission;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Earnings & Commission</h1>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" /><Skeleton className="h-28" /><Skeleton className="h-28" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5"><p className="text-sm text-slate-500">Platform Revenue</p><p className="text-2xl font-bold">{formatCurrency(totalEarnings)}</p></Card>
          <Card className="p-5"><p className="text-sm text-slate-500">Commission (15%)</p><p className="text-2xl font-bold">{formatCurrency(commission)}</p></Card>
          <Card className="p-5"><p className="text-sm text-slate-500">Provider Payouts</p><p className="text-2xl font-bold">{formatCurrency(payouts)}</p></Card>
        </div>
      )}
      <Card className="p-5">
        <h3 className="font-semibold mb-4">Revenue Overview</h3>
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          Detailed revenue breakdown coming soon
        </div>
      </Card>
    </div>
  );
}
