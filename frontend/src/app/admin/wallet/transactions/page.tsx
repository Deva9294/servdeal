'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';

interface Transaction {
  _id: string;
  transactionId: string;
  payuTxnId?: string;
  user: { name: string; email: string; phone?: string };
  amount: number;
  type: string;
  status: string;
  description: string;
  createdAt: string;
}

export default function AdminWalletTransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-wallet-transactions', page, search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '50');
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get(`/admin/wallet/transactions?${params.toString()}`);
      return res.data.data;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"><CheckCircle className="h-3 w-3" /> Success</span>;
      case 'pending': return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"><Clock className="h-3 w-3" /> Pending</span>;
      case 'failed': return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"><XCircle className="h-3 w-3" /> Failed</span>;
      case 'cancelled': return <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"><AlertCircle className="h-3 w-3" /> Cancelled</span>;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'credit'
      ? <ArrowDownLeft className="h-4 w-4 text-green-600" />
      : <ArrowUpRight className="h-4 w-4 text-red-600" />;
  };

  const transactions: Transaction[] = data?.transactions || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Wallet Transactions</h1>

      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user name, email, phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
            />
          </div>
          <div className="flex gap-2">
            {['', 'success', 'pending', 'failed'].map((s) => (
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
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs font-medium uppercase text-slate-500">
                <th className="px-4 py-3">Txn ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><Skeleton className="h-8" /></td></tr>
              ))}
              {!isLoading && transactions.map((t) => (
                <tr key={t._id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{t.transactionId}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{t.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">{t.user?.email || t.user?.phone || ''}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">{getTypeIcon(t.type)} {t.type}</span>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(t.status)}</td>
                  <td className="px-4 py-3 text-slate-600">{t.description || '-'}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(t.createdAt).toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {!isLoading && transactions.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">No transactions found</td></tr>
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
