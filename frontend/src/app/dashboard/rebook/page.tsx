'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { RefreshCw, Calendar, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { API_URL } from '@/lib/constants';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function getToken() {
  return localStorage.getItem('token') || '';
}

export default function RebookPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rebookedId, setRebookedId] = useState<string | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['rebookable-bookings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/rebook/bookings`, { headers: { Authorization: `Bearer ${getToken()}` } });
      const json = await res.json();
      return json.data || [];
    },
  });

  const rebookMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await fetch(`${API_URL}/rebook/${bookingId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to rebook');
      return json.data;
    },
    onSuccess: (data) => {
      setRebookedId(data._id);
      queryClient.invalidateQueries({ queryKey: ['rebookable-bookings'] });
    },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Rebook Services</h1>
        <p className="text-slate-500">Quickly rebook services you have used before</p>
      </div>

      {rebookedId && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
        >
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="font-medium text-emerald-800">Service rebooked successfully!</p>
            <button
              onClick={() => router.push(`/dashboard/bookings/${rebookedId}`)}
              className="text-sm font-medium text-emerald-700 underline"
            >
              View booking →
            </button>
          </div>
        </motion.div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : !bookings?.length ? (
          <div className="flex flex-col items-center p-12 text-center">
            <RefreshCw className="h-12 w-12 text-slate-300" />
            <p className="mt-4 font-medium text-slate-900">No completed bookings yet</p>
            <p className="mt-1 text-sm text-slate-500">Complete a service to see rebooking options here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {bookings.map((b: { _id: string; service?: { name?: string }; bookingId?: string; completedAt?: string; createdAt: string; address?: { city?: string }; amount?: number }) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                    <RefreshCw className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{b.service?.name}</p>
                    <p className="text-xs text-slate-500">Booking #{b.bookingId}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(b.completedAt || b.createdAt).toLocaleDateString('en-IN')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {b.address?.city || '—'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <p className="font-semibold text-slate-900">₹{b.amount?.toLocaleString('en-IN')}</p>
                  <button
                    onClick={() => rebookMutation.mutate(b._id)}
                    disabled={rebookMutation.isPending}
                    className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-60"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Rebook
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
