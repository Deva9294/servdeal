'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

export default function AdminWarrantiesPage() {
  const [status, setStatus] = useState('all');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-warranties', status],
    queryFn: async () => {
      const res = await api.get(`/warranties/admin/all?status=${status}`);
      return res.data;
    },
  });

  const updateClaimMutation = useMutation({
    mutationFn: ({ id, status: s, resolution }: { id: string; status: string; resolution?: string }) =>
      api.patch(`/warranties/admin/${id}/claim`, { status: s, resolution }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-warranties'] }),
  });

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      active: 'bg-emerald-100 text-emerald-700',
      expired: 'bg-slate-100 text-slate-700',
      claimed: 'bg-amber-100 text-amber-700',
      resolved: 'bg-blue-100 text-blue-700',
    };
    return map[s] || 'bg-slate-100 text-slate-700';
  };

  const warranties = data?.data || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Warranty Management</h1>
      <p className="text-slate-500">Manage service warranties and claims</p>

      <div className="mb-4 mt-6 flex gap-2">
        {['all', 'active', 'claimed', 'expired', 'resolved'].map((s) => (
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
        ) : !warranties.length ? (
          <div className="flex flex-col items-center p-12 text-center">
            <ShieldCheck className="h-12 w-12 text-slate-300" />
            <p className="mt-4 font-medium text-slate-900">No warranties found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="px-4 py-3 font-medium">Warranty ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Service</th>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium">Expires</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Claim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {warranties.map((w: { _id: string; warrantyId: string; user?: { name?: string; phone?: string }; service?: { name?: string }; provider?: { businessName?: string }; expiresAt: string; status: string; claim?: { status: string; reason?: string; description?: string } }) => (
                  <tr key={w._id}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-900">{w.warrantyId}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{w.user?.name}</p>
                      <p className="text-xs text-slate-500">{w.user?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{w.service?.name}</td>
                    <td className="px-4 py-3 text-slate-600">{w.provider?.businessName}</td>
                    <td className="px-4 py-3 text-slate-600">{new Date(w.expiresAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(w.status)}`}>
                        {w.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {w.claim?.status !== 'none' ? (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-600">{w.claim?.reason}</p>
                          <p className="text-xs text-slate-500">{w.claim?.description}</p>
                          {w.claim?.status === 'submitted' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateClaimMutation.mutate({ id: w._id, status: 'approved' })}
                                className="rounded bg-emerald-500 px-2 py-1 text-xs text-white"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateClaimMutation.mutate({ id: w._id, status: 'rejected', resolution: 'Claim rejected' })}
                                className="rounded bg-red-500 px-2 py-1 text-xs text-white"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {w.claim?.status === 'approved' && (
                            <button
                              onClick={() => updateClaimMutation.mutate({ id: w._id, status: 'resolved', resolution: 'Issue resolved' })}
                              className="rounded bg-blue-500 px-2 py-1 text-xs text-white"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">No claim</span>
                      )}
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
