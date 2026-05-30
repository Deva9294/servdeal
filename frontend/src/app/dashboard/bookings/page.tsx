'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import { SERVICES } from '@/data/services';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { ChevronRight, Download, RotateCcw } from 'lucide-react';

const tabs = ['all', 'upcoming', 'ongoing', 'completed', 'cancelled'] as const;

export default function BookingsPage() {
  const [tab, setTab] = useState<string>('all');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings', tab],
    queryFn: async () => {
      const res = await api.get(`/bookings/my${tab !== 'all' ? `?status=${tab}` : ''}`);
      return res.data.data;
    },
  });

  return (
    <div>
      <PageHeader title="My Bookings" description="View and manage all your service bookings" />

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium capitalize ${tab === t ? 'bg-brand-orange text-white' : 'bg-white text-slate-600 card-shadow'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <div className="space-y-3">
          {bookings?.length === 0 && <p className="text-sm text-slate-500">No bookings found.</p>}
          {(bookings || []).map((b: { _id: string; bookingId: string; service: { name: string }; status: string; scheduledAt: string; address: { city: string }; amount: number }) => {
            const slug = SERVICES.find((s) => b.service?.name?.includes(s.name.split(' ')[0]))?.slug || 'electrician';
            return (
              <Card key={b._id} className="flex flex-wrap items-center gap-4 p-4">
                <ServiceIcon name={SERVICES.find((s) => s.slug === slug)?.icon || 'Zap'} className="bg-amber-100" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{b.service?.name}</p>
                  <p className="text-xs text-slate-500">
                    #{b.bookingId} · {new Date(b.scheduledAt).toLocaleString('en-IN')} · {b.address?.city}
                  </p>
                </div>
                <Badge status={b.status}>{b.status}</Badge>
                <p className="font-bold">{formatCurrency(b.amount)}</p>
                <div className="flex gap-2">
                  {b.status === 'ongoing' && (
                    <Link href="/dashboard/bookings/track"><Button size="sm" variant="secondary">Track</Button></Link>
                  )}
                  {b.status === 'completed' && (
                    <>
                      <Button size="sm" variant="outline"><Download className="h-4 w-4" /> Invoice</Button>
                      <Button size="sm" variant="outline"><RotateCcw className="h-4 w-4" /> Re-book</Button>
                    </>
                  )}
                  <Link href={`/dashboard/bookings/${b._id}`}><ChevronRight className="h-5 w-5 text-slate-400" /></Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
