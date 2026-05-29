'use client';

import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { city: 'Patna', revenue: 875000 },
  { city: 'Delhi', revenue: 1200000 },
  { city: 'Mumbai', revenue: 980000 },
];

export default function AdminEarningsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Earnings & Commission</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-sm text-slate-500">Platform Revenue</p><p className="text-2xl font-bold">{formatCurrency(2875430)}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500">Commission (15%)</p><p className="text-2xl font-bold">{formatCurrency(431314)}</p></Card>
        <Card className="p-5"><p className="text-sm text-slate-500">Provider Payouts</p><p className="text-2xl font-bold">{formatCurrency(2444116)}</p></Card>
      </div>
      <Card className="p-5">
        <h3 className="font-semibold mb-4">Revenue by City</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}><XAxis dataKey="city" /><YAxis /><Tooltip /><Bar dataKey="revenue" fill="#ff7a00" /></BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
