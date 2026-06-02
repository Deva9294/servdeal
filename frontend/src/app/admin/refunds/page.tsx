'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

export default function AdminRefundsPage() {
  const [status, setStatus] = useState('all');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-refunds', status],
    queryFn: async () => {
      const res = await api.get(`/refunds/admin/all?status=${status}`);
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/refunds/admin/${id}/approve`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-refunds'] }),
  });

  const processMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/refunds/admin/${id}/process`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-refunds'] }),
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

  const refunds = data?.data || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Refund Requests</h1>
      <p className="text-slate-500">Manage and process customer refund requests</p>

      <div className="mb-4 mt-6 flex gap-2">
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
        ) : !refunds.length ? (
          <div className="flex flex-col items-center p-12 text-center">
            <RotateCcw className="h-12 w-12 text-slate-300" />
            <p className="mt-4 font-medium text-slate-900">No refund requests</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Booking</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {refunds.map((r: { _id: string; status: string; user?: { name?: string; email?: string }; booking?: { bookingId?: string }; amount?: number; reason: string }) => (
                  <tr key={r._id}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{r._id.slice(-6)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{r.user?.name}</p>
                      <p className="text-xs text-slate-500">{r.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.booking?.bookingId || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">₹{r.amount?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-slate-600">{r.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {r.status === 'pending' && (
                          <button
                            onClick={() => approveMutation.mutate(r._id)}
                            disabled={approveMutation.isPending}
                            className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {r.status === 'approved' && (
                          <button
                            onClick={() => processMutation.mutate(r._id)}
                            disabled={processMutation.isPending}
                            className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
                          >
                            Process
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
