'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { Wrench, Calendar, MapPin, IndianRupee, CheckCircle, Clock } from 'lucide-react';

type Booking = {
  _id: string;
  serviceName?: string;
  status: string;
  scheduledAt?: string;
  amount?: number;
  address?: string;
};

export default function WorkerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/workers/bookings')
      .then((res) => setBookings(res.data.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-slate-500">Loading bookings...</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="text-xl font-bold text-brand-navy">My Bookings</h2>
      <div className="grid gap-4">
        {bookings.map((b) => (
          <Card key={b._id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-brand-orange" />
                  <span className="font-semibold">{b.serviceName || 'Service'}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString() : 'TBD'}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {b.address || 'No address'}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {b.amount || 0}</span>
                </div>
              </div>
              <StatusBadge status={b.status} />
            </div>
          </Card>
        ))}
        {bookings.length === 0 && (
          <Card className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-slate-500">No bookings yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; icon: React.ReactNode }> = {
    completed: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="h-3 w-3" /> },
    pending: { color: 'bg-amber-100 text-amber-700', icon: <Clock className="h-3 w-3" /> },
    confirmed: { color: 'bg-blue-100 text-blue-700', icon: <CheckCircle className="h-3 w-3" /> },
  };
  const style = map[status] || { color: 'bg-slate-100 text-slate-600', icon: <Clock className="h-3 w-3" /> };
  return (
    <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style.color}`}>
      {style.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
