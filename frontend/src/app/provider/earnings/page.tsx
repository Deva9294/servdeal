'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProviderEarningsPage() {
  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await api.get('/payments/wallet');
      return res.data.data;
    },
  });

  const balance = wallet?.balance || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Earnings</h1>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5"><p className="text-sm text-slate-500">This Month</p><p className="text-2xl font-bold">{formatCurrency(balance)}</p></Card>
          <Card className="p-5"><p className="text-sm text-slate-500">Pending Payout</p><p className="text-2xl font-bold">{formatCurrency(0)}</p></Card>
          <Card className="p-5"><p className="text-sm text-slate-500">Total Earned</p><p className="text-2xl font-bold">{formatCurrency(balance)}</p></Card>
        </div>
      )}
      <Card className="p-5">
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          Earnings chart coming soon
        </div>
      </Card>
      <Card className="flex items-center justify-between p-5">
        <div><p className="font-semibold">Withdraw to Bank</p><p className="text-sm text-slate-500">Add bank account in settings</p></div>
        <Button disabled>Withdraw</Button>
      </Card>
    </div>
  );
}
