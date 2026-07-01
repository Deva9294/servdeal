'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Percent, Clock, CheckCircle, AlertCircle, Gift } from 'lucide-react';
import api from '@/lib/api';

export default function CashbackPage() {
  const [status, setStatus] = useState('all');

  const { data: stats } = useQuery({
    queryKey: ['cashback-stats'],
    queryFn: async () => {
      const res = await api.get('/cashback/stats');
      return res.data.data;
    },
  });

  const { data: cashbacks, isLoading } = useQuery({
    queryKey: ['cashbacks', status],
    queryFn: async () => {
      const res = await api.get(`/cashback/my?status=${status}`);
      return res.data.data || [];
    },
  });

  const statCards = [
    { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Credited', value: stats?.credited || 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Expired', value: stats?.expired || 0, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      credited: 'bg-emerald-100 text-emerald-700',
      expired: 'bg-red-100 text-red-700',
      reversed: 'bg-slate-100 text-slate-700',
    };
    return map[s] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Cashback</h1>
        <p className="text-slate-500">Track your earned and pending cashback rewards</p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-100 bg-white p-5"
          >
            <div className={`inline-flex rounded-lg ${s.bg} p-2`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">₹{s.value.toLocaleString('en-IN')}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        {['all', 'pending', 'credited', 'expired'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
              status === s ? 'bg-orange-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : !cashbacks?.length ? (
          <div className="flex flex-col items-center p-12 text-center">
            <Gift className="h-12 w-12 text-slate-300" />
            <p className="mt-4 font-medium text-slate-900">No cashback yet</p>
            <p className="mt-1 text-sm text-slate-500">Complete bookings to earn cashback rewards</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {cashbacks.map((cb: { _id: string; description: string; percentage: number; createdAt: string; amount: number; status: string }) => (
              <div key={cb._id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                    <Percent className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{cb.description}</p>
                    <p className="text-xs text-slate-500">
                      {cb.percentage > 0 ? `${cb.percentage}% · ` : ''} {new Date(cb.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">+₹{cb.amount}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(cb.status)}`}>
                    {cb.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
