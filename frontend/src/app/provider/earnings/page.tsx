'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = Array.from({ length: 12 }, (_, i) => ({ month: `M${i + 1}`, amount: 12000 + Math.random() * 8000 }));

export default function ProviderEarningsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Earnings</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-sm text-slate-500">This Month</p><p className="text-2xl font-bold">{formatCurrency(18750)}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500">Pending Payout</p><p className="text-2xl font-bold">{formatCurrency(3250)}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500">Total Earned</p><p className="text-2xl font-bold">{formatCurrency(245000)}</p></Card>
      </div>
      <Card className="p-5">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#ff7a00" fill="#ff7a00" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="flex items-center justify-between p-5">
        <div><p className="font-semibold">Withdraw to Bank</p><p className="text-sm text-slate-500">HDFC ****4521</p></div>
        <Button>Withdraw {formatCurrency(3250)}</Button>
      </Card>
    </div>
  );
}
