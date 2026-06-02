'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import api from '@/lib/api';
import { useState } from 'react';
import { CheckCircle, XCircle, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

interface PaymentLog {
  _id: string;
  gateway: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  amount: number;
  status: string;
  hashVerified: boolean;
  hashMatch: boolean;
  errorMessage?: string;
  processedBy: string;
  ipAddress?: string;
  user?: { name: string; email: string };
  createdAt: string;
}

export default function AdminPaymentLogsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payment-logs', page, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '50');
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get(`/admin/wallet/payment-logs?${params.toString()}`);
      return res.data.data;
    },
  });

  const getStatusBadge = (status: string) => {
    if (status === 'paid') return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"><CheckCircle className="h-3 w-3" /> Paid</span>;
    if (status === 'failed') return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"><XCircle className="h-3 w-3" /> Failed</span>;
    if (status === 'duplicate') return <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700"><AlertTriangle className="h-3 w-3" /> Duplicate</span>;
    if (status === 'created') return <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"><Clock className="h-3 w-3" /> Created</span>;
    return <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">{status}</span>;
  };

  const getHashBadge = (verified: boolean, match: boolean) => {
    if (!verified) return <span className="text-xs text-slate-400">Not verified</span>;
    return match
      ? <span className="inline-flex items-center gap-1 text-xs text-green-600"><ShieldCheck className="h-3 w-3" /> Valid</span>
      : <span className="inline-flex items-center gap-1 text-xs text-red-600"><XCircle className="h-3 w-3" /> Invalid</span>;
  };

  const logs: PaymentLog[] = data?.logs || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Payment Logs</h1>

      <Card className="p-5">
        <div className="flex flex-wrap gap-2">
          {['', 'paid', 'failed', 'duplicate', 'created'].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === s ? 'bg-brand-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
                <th className="px-4 py-3">Gateway</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Hash</th>
                <th className="px-4 py-3">Processed By</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={9} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>
              ))}
              {!isLoading && logs.map((log) => (
                <tr key={log._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium uppercase">{log.gateway}</td>
                  <td className="px-4 py-3 font-mono text-xs">{log.gatewayOrderId || '-'}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{log.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{log.user?.email || ''}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold">₹{log.amount?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">{getStatusBadge(log.status)}</td>
                  <td className="px-4 py-3">{getHashBadge(log.hashVerified, log.hashMatch)}</td>
                  <td className="px-4 py-3 text-xs capitalize">{log.processedBy}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{log.ipAddress || '-'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {!isLoading && logs.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-500">No payment logs found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {total > 50 && (
          <div className="flex items-center justify-center gap-2 border-t p-4">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Previous</Button>
            <span className="text-xs text-slate-500">Page {page} of {Math.ceil(total / 50)}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={page * 50 >= total}>Next</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
