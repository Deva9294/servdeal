'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Receipt, Download, Printer } from 'lucide-react';
import { API_URL } from '@/lib/constants';

function getToken() {
  return localStorage.getItem('token') || '';
}

export default function InvoicesPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['invoices-bookings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/bookings/my`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const json = await res.json();
      return (json.data || []).filter((b: { paymentStatus?: string }) => b.paymentStatus === 'paid');
    },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
        <p className="text-slate-500">View and download invoices for your paid bookings</p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : !bookings?.length ? (
          <div className="flex flex-col items-center p-12 text-center">
            <Receipt className="h-12 w-12 text-slate-300" />
            <p className="mt-4 font-medium text-slate-900">No invoices yet</p>
            <p className="mt-1 text-sm text-slate-500">Invoices will appear after you complete a paid booking</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookings.map((b: { _id: string; service?: { name?: string }; bookingId?: string; completedAt?: string; createdAt: string; amount?: number }) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                    <Receipt className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Booking #{b.bookingId}</p>
                    <p className="text-sm text-slate-600">{b.service?.name || 'Service'}</p>
                    <p className="text-xs text-slate-500">{new Date(b.completedAt || b.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p className="font-semibold text-slate-900">₹{b.amount?.toLocaleString('en-IN')}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(`/api/v1/invoices/booking/${b._id}?token=${getToken()}`, '_blank')}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      <Printer className="h-4 w-4" />
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
