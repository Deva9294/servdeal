'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import { API_URL } from '@/lib/constants';

function getToken() {
  return localStorage.getItem('token') || '';
}

export default function WarrantiesPage() {
  const [status, setStatus] = useState('all');

  const { data: warranties, isLoading } = useQuery({
    queryKey: ['warranties', status],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/warranties/my?status=${status}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const json = await res.json();
      return json.data || [];
    },
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

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Warranties</h1>
        <p className="text-slate-500">View and manage service warranties</p>
      </div>

      <div className="mb-4 flex gap-2">
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
        ) : !warranties?.length ? (
          <div className="flex flex-col items-center p-12 text-center">
            <ShieldCheck className="h-12 w-12 text-slate-300" />
            <p className="mt-4 font-medium text-slate-900">No warranties yet</p>
            <p className="mt-1 text-sm text-slate-500">Warranties for completed services will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {warranties.map((w: { _id: string; status: string; warrantyId: string; service?: { name?: string }; provider?: { businessName?: string }; expiresAt: string; claim?: { status: string; reason?: string; description?: string } }) => (
              <motion.div
                key={w._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {w.status === 'active' ? (
                      <ShieldCheck className="h-6 w-6 text-emerald-500" />
                    ) : w.status === 'expired' ? (
                      <Clock className="h-6 w-6 text-slate-400" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-amber-500" />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{w.warrantyId}</p>
                      <p className="text-sm text-slate-600">{w.service?.name}</p>
                      <p className="text-xs text-slate-500">{w.provider?.businessName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(w.status)}`}>
                      {w.status}
                    </span>
                    <p className="mt-1 text-xs text-slate-500">
                      Exp: {new Date(w.expiresAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                {w.claim?.status !== 'none' && (
                  <div className="mt-3 rounded-lg bg-amber-50 p-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <p className="text-sm font-medium text-amber-800">Claim Submitted</p>
                    </div>
                    <p className="mt-1 text-xs text-amber-700">{w.claim?.reason} — {w.claim?.status.replace('_', ' ')}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
