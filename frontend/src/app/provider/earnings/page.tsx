'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { Wallet, TrendingUp, Clock, ArrowUpRight, Calendar } from 'lucide-react';

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

export default function ProviderEarningsPage() {
  const { data: wallet, isLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await api.get('/payments/wallet');
      return res.data.data;
    },
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/payments/wallet/transactions');
      setTransactions(data.transactions || []);
    } catch {
      // ignore
    } finally {
      setTxLoading(false);
    }
  };

  const balance = wallet?.balance || 0;
  const thisMonth = transactions
    .filter((t) => new Date(t.createdAt).getMonth() === new Date().getMonth() && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const pending = transactions
    .filter((t) => t.type === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader title="Earnings Dashboard" description="Track your income, payouts, and performance" />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100"><Wallet className="h-5 w-5 text-green-600" /></div>
              <div>
                <p className="text-sm text-slate-500">Wallet Balance</p>
                <p className="text-2xl font-bold text-brand-navy">{formatCurrency(balance)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange/10"><TrendingUp className="h-5 w-5 text-brand-orange" /></div>
              <div>
                <p className="text-sm text-slate-500">This Month</p>
                <p className="text-2xl font-bold text-brand-navy">{formatCurrency(thisMonth)}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100"><Clock className="h-5 w-5 text-blue-600" /></div>
              <div>
                <p className="text-sm text-slate-500">Pending Payout</p>
                <p className="text-2xl font-bold text-brand-navy">{formatCurrency(pending)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card className="p-5">
        <h3 className="mb-4 font-bold text-brand-navy flex items-center gap-2"><Calendar className="h-4 w-4" /> Recent Transactions</h3>
        {txLoading ? (
          <div className="space-y-2"><Skeleton className="h-10" /><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-slate-500">No transactions yet</p>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 10).map((tx) => (
              <div key={tx._id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-brand-navy">{tx.description}</p>
                  <p className="text-xs text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`flex items-center gap-1 font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="flex items-center justify-between p-5">
        <div><p className="font-semibold">Withdraw to Bank</p><p className="text-sm text-slate-500">Add bank account in settings</p></div>
        <Button disabled>Withdraw</Button>
      </Card>
    </div>
  );
}
