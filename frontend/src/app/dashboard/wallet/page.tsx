'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/lib/utils';
import { payWithPayU } from '@/lib/payu';
import { payWithRazorpay } from '@/lib/razorpay';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Wallet, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, XCircle, AlertCircle, IndianRupee, Plus, RefreshCw, CreditCard, ShieldCheck } from 'lucide-react';

interface Transaction {
  _id: string;
  transactionId: string;
  type: 'credit' | 'debit';
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  amount: number;
  description: string;
  createdAt: string;
}

export default function WalletPage() {
  const [amount, setAmount] = useState('500');
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const qc = useQueryClient();
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      toast.success('Wallet recharge successful! Your balance has been updated.');
      qc.invalidateQueries({ queryKey: ['wallet'] });
      qc.invalidateQueries({ queryKey: ['wallet-transactions'] });
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', window.location.pathname);
      }
    } else if (payment === 'failed') {
      toast.error('Payment failed. Please try again or use a different method.');
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [searchParams, qc]);

  const { data: walletData, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const res = await api.get('/payments/wallet');
      return res.data.data;
    },
  });

  const { data: txnData, isLoading: txnLoading } = useQuery({
    queryKey: ['wallet-transactions', filterStatus, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      params.set('page', String(page));
      params.set('limit', '20');
      const res = await api.get(`/payments/wallet/transactions?${params.toString()}`);
      return res.data.data;
    },
  });

  const { data: config } = useQuery({
    queryKey: ['payment-config'],
    queryFn: async () => {
      const res = await api.get('/payments/config');
      return res.data;
    },
  });

  const payuEnabled = config?.payu?.enabled;
  const razorpayEnabled = config?.razorpay?.enabled;
  const anyGateway = payuEnabled || razorpayEnabled;
  const gatewayName = payuEnabled ? 'PayU' : razorpayEnabled ? 'Razorpay' : 'None';

  const handleTopUp = async () => {
    const amt = Number(amount);
    if (!amt || amt < 1) return toast.error('Enter a valid amount');
    if (!anyGateway) return toast.error('No payment gateway is configured. Contact support.');
    setLoading(true);
    try {
      if (razorpayEnabled) {
        await payWithRazorpay({ amount: amt, purpose: 'wallet', description: 'Wallet top-up' });
        toast.success('Payment successful!');
      } else {
        await payWithPayU({ amount: amt, purpose: 'wallet', description: 'Wallet top-up' });
        toast.success('Redirecting to PayU for payment...');
      }
      qc.invalidateQueries({ queryKey: ['wallet'] });
      qc.invalidateQueries({ queryKey: ['wallet-transactions'] });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700"><CheckCircle className="h-3 w-3" /> Success</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"><Clock className="h-3 w-3" /> Pending</span>;
      case 'failed':
        return <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"><XCircle className="h-3 w-3" /> Failed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"><AlertCircle className="h-3 w-3" /> Cancelled</span>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'credit'
      ? <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50"><ArrowDownLeft className="h-4 w-4 text-green-600" /></div>
      : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50"><ArrowUpRight className="h-4 w-4 text-red-600" /></div>;
  };

  const quickAmounts = ['100', '500', '1000', '2000', '5000'];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="My Wallet" description="Manage your ServDeal wallet balance" />

      {/* Balance Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-brand-navy to-blue-900 p-8 text-white">
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-white/70" />
            <p className="text-white/70 text-sm">Available Balance</p>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <IndianRupee className="h-6 w-6 text-white/90" />
            <p className="text-5xl font-bold tracking-tight">
              {walletLoading ? (
                <Skeleton className="inline-block h-12 w-40 bg-white/20" />
              ) : (
                (walletData?.balance || 0).toLocaleString('en-IN')
              )}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
              <ArrowDownLeft className="h-3.5 w-3.5 text-green-300" />
              Credited: {formatCurrency(walletData?.totalCredited || 0)}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
              <ArrowUpRight className="h-3.5 w-3.5 text-red-300" />
              Debited: {formatCurrency(walletData?.totalDebited || 0)}
            </span>
          </div>
        </div>
      </Card>

      {/* Add Money Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5 text-brand-orange" />
          <h3 className="font-semibold text-brand-navy">Add Money</h3>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
            <ShieldCheck className="h-3 w-3" /> {gatewayName}
          </span>
        </div>

        {!config && (
          <div className="space-y-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-10" />
          </div>
        )}
        {config && !anyGateway && (
          <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-700">
            <AlertCircle className="inline h-4 w-4 mr-1" />
            Payment gateway is not configured. Please contact support to add money.
          </div>
        )}
        {anyGateway && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {quickAmounts.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    amount === a
                      ? 'border-brand-orange bg-orange-50 text-brand-orange'
                      : 'border-slate-200 hover:border-brand-orange/50 hover:bg-orange-50/50'
                  }`}
                >
                  ₹{a}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={1}
                  className="pl-9"
                  placeholder="Enter amount"
                />
              </div>
              <Button onClick={handleTopUp} disabled={loading} className="gap-2">
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                )}
                {loading ? 'Processing...' : `Pay ₹${Number(amount) || 0}`}
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              You will be securely redirected to {gatewayName} to complete the payment.
            </p>
          </div>
        )}
      </Card>

      {/* Transactions */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-brand-navy">Transaction History</h3>
          <div className="flex gap-2">
            {['', 'success', 'pending', 'failed'].map((s) => (
              <button
                key={s || 'all'}
                onClick={() => { setFilterStatus(s); setPage(1); }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  filterStatus === s
                    ? 'bg-brand-navy text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {txnLoading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          )}

          {!txnLoading && (txnData?.transactions || []).map((t: Transaction) => (
            <div
              key={t._id}
              className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                {getTypeIcon(t.type)}
                <div>
                  <p className="text-sm font-medium text-slate-800">{t.description || 'Transaction'}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-slate-500">{new Date(t.createdAt).toLocaleDateString('en-IN')}</span>
                    <span className="text-xs text-slate-400">{t.transactionId}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'credit' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
                <div className="mt-1">{getStatusBadge(t.status)}</div>
              </div>
            </div>
          ))}

          {!txnLoading && !txnData?.transactions?.length && (
            <div className="py-12 text-center">
              <Wallet className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No transactions found</p>
            </div>
          )}
        </div>

        {txnData && txnData.total > txnData.limit && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="text-xs text-slate-500">
              Page {page} of {Math.ceil(txnData.total / txnData.limit)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page * txnData.limit >= txnData.total}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
