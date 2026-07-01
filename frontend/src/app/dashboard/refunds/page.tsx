'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function RefundsPage() {
  const [status, setStatus] = useState('all');

  const { data: refunds, isLoading } = useQuery({
    queryKey: ['refunds', status],
    queryFn: async () => {
      const res = await api.get(`/refunds/my?status=${status}`);
      return res.data.data || [];
    },
  });

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700',
      approved: 'bg-blue-100 text-blue-700',
      processing: 'bg-purple-100 text-purple-700',
      completed: 'bg-emerald-100 text-emerald-700',
      failed: 'bg-red-100 text-red-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return map[s] || 'bg-slate-100 text-slate-700';
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Refunds</h1>
        <p className="text-slate-500">Track your refund requests and status</p>
      </div>

      <div className="mb-4 flex gap-2">
        {['all', 'pending', 'approved', 'processing', 'completed', 'rejected'].map((s) => (
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
        ) : !refunds?.length ? (
          <div className="flex flex-col items-center p-12 text-center">
            <RotateCcw className="h-12 w-12 text-slate-300" />
            <p className="mt-4 font-medium text-slate-900">No refunds yet</p>
            <p className="mt-1 text-sm text-slate-500">Your refund history will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {refunds.map((r: { _id: string; status: string; booking?: { bookingId?: string }; createdAt: string; amount?: number; reason: string; refundMethod?: string }) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  {statusIcon(r.status)}
                  <div>
                    <p className="font-medium text-slate-900">Refund #{r._id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-500">
                      Booking {r.booking?.bookingId || ''} · {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{r.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">₹{r.amount?.toLocaleString('en-IN')}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(r.status)}`}>
                    {r.status}
                  </span>
                  {r.refundMethod && (
                    <p className="mt-1 text-xs text-slate-500 capitalize">{r.refundMethod.replace('_', ' ')}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
