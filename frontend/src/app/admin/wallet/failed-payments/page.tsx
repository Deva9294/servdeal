'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import api from '@/lib/api';
import { useState } from 'react';
import { AlertTriangle, XCircle, AlertCircle, User, CreditCard, Calendar } from 'lucide-react';

interface FailedPayment {
  _id: string;
  gateway: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  amount: number;
  status: string;
  errorMessage?: string;
  processedBy: string;
  ipAddress?: string;
  user?: { name: string; email: string; phone?: string };
  payment?: { amount: number; metadata?: Record<string, unknown> };
  createdAt: string;
}

export default function AdminFailedPaymentsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-failed-payments', page],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '50');
      const res = await api.get(`/admin/wallet/failed-payments?${params.toString()}`);
      return res.data.data;
    },
  });

  const payments: FailedPayment[] = data?.logs || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-7 w-7 text-red-600" />
        <h1 className="text-2xl font-bold text-brand-navy">Failed / Duplicate Payments</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-slate-500 uppercase">Total Failed</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 uppercase">Total Amount At Risk</p>
          <p className="mt-1 text-2xl font-bold text-brand-navy">
            ₹{payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString('en-IN')}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-slate-500 uppercase">Recent (24h)</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {payments.filter((p) => new Date(p.createdAt) > new Date(Date.now() - 86400000)).length}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
                <th className="px-4 py-3">Gateway</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Error</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>
              ))}
              {!isLoading && payments.map((p) => (
                <tr key={p._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium uppercase">{p.gateway}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="font-medium">{p.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-500">{p.user?.email || p.user?.phone || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                      ₹{(p.amount || 0).toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === 'failed' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"><XCircle className="h-3 w-3" /> Failed</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700"><AlertCircle className="h-3 w-3" /> Duplicate</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-red-600 max-w-xs truncate">{p.errorMessage || '-'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.ipAddress || '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.createdAt).toLocaleString('en-IN')}
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && payments.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                  <AlertTriangle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  No failed or duplicate payments found
                </td></tr>
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
