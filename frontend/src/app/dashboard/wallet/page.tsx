'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { payWithPayU } from '@/lib/payu';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function WalletPage() {
  const [amount, setAmount] = useState('500');
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await api.get('/payments/wallet');
      return res.data.data;
    },
  });

  const topUpPayU = async () => {
    const amt = Number(amount);
    if (!amt || amt < 1) return toast.error('Enter valid amount');
    setLoading(true);
    try {
      await payWithPayU({ amount: amt, purpose: 'wallet', description: 'Wallet top-up' });
      toast.success('Redirecting to PayU for payment...');
      qc.invalidateQueries({ queryKey: ['wallet'] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="My Wallet" description="Add money via PayU (UPI / Card)" />
      <Card className="bg-gradient-to-br from-brand-navy to-blue-900 p-8 text-white">
        <p className="text-white/70">Available Balance</p>
        <p className="mt-2 text-4xl font-bold">{formatCurrency(data?.balance || 0)}</p>
      </Card>
      <Card className="p-5 space-y-4">
        <h3 className="font-semibold">Add Money (PayU)</h3>
        <div className="flex gap-2">
          {['500', '1000', '2000'].map((a) => (
            <button key={a} onClick={() => setAmount(a)} className={`rounded-lg border px-4 py-2 text-sm ${amount === a ? 'border-brand-orange bg-orange-50' : ''}`}>₹{a}</button>
          ))}
        </div>
        <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min={1} />
        <Button className="w-full" onClick={topUpPayU} disabled={loading}>
          {loading ? 'Opening PayU...' : `Pay ${formatCurrency(Number(amount) || 0)}`}
        </Button>
      </Card>
      <Card className="p-5">
        <h3 className="font-semibold mb-4">Transactions</h3>
        <div className="space-y-3">
          {(data?.transactions || []).map((t: { type: string; amount: number; description: string; createdAt: string }, i: number) => (
            <div key={i} className="flex justify-between border-b pb-3 text-sm">
              <div>
                <p className="font-medium">{t.description}</p>
                <p className="text-slate-500">{new Date(t.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
              <span className={t.type === 'credit' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
            </div>
          ))}
          {!data?.transactions?.length && <p className="text-sm text-slate-500">No transactions yet</p>}
        </div>
      </Card>
    </div>
  );
}
