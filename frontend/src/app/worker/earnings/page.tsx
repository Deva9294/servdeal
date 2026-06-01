'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { IndianRupee, TrendingUp, Wallet, Calendar } from 'lucide-react';

interface Transaction {
  _id: string;
  description?: string;
  date?: string;
  amount?: number;
}

export default function WorkerEarningsPage() {
  const [earnings, setEarnings] = useState({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/workers/earnings')
      .then((res) => {
        setEarnings(res.data.earnings || { total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
        setTransactions(res.data.transactions || []);
      })
      .catch(() => {
        setEarnings({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-slate-500">Loading earnings...</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="text-xl font-bold text-brand-navy">My Earnings</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <EarningCard label="Total Earnings" amount={earnings.total} icon={<Wallet className="h-5 w-5 text-white" />} color="bg-brand-navy" />
        <EarningCard label="Today" amount={earnings.today} icon={<IndianRupee className="h-5 w-5 text-white" />} color="bg-green-600" />
        <EarningCard label="This Week" amount={earnings.thisWeek} icon={<Calendar className="h-5 w-5 text-white" />} color="bg-blue-600" />
        <EarningCard label="This Month" amount={earnings.thisMonth} icon={<TrendingUp className="h-5 w-5 text-white" />} color="bg-brand-orange" />
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-brand-navy">Recent Transactions</h3>
        <div className="mt-4 space-y-3">
          {transactions.map((tx) => (
            <div key={tx._id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{tx.description || 'Job payment'}</p>
                <p className="text-xs text-slate-500">{tx.date ? new Date(tx.date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <span className="font-semibold text-green-600">+₹{tx.amount || 0}</span>
            </div>
          ))}
          {transactions.length === 0 && <p className="text-sm text-slate-500 text-center py-8">No transactions yet.</p>}
        </div>
      </Card>
    </div>
  );
}

function EarningCard({ label, amount, icon, color }: { label: string; amount: number; icon: React.ReactNode; color: string }) {
  return (
    <Card className={`${color} p-5 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs opacity-80">{label}</p>
          <p className="mt-1 text-2xl font-bold">₹{amount.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-white/20 p-2">{icon}</div>
      </div>
    </Card>
  );
}
