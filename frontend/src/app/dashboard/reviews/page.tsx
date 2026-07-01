'use client';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

export default function ReviewsPage() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['reviewable-bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/my');
      return (res.data.data || []).filter((b: { status?: string; review?: unknown }) => b.status === 'completed' && !b.review);
    },
  });

  const submit = async () => {
    if (!selectedBooking) return toast.error('Please select a booking to review');
    try {
      await api.post('/reviews', { rating, comment, booking: selectedBooking });
      toast.success('Review submitted!');
      setRating(5);
      setComment('');
      setSelectedBooking(null);
    } catch {
      toast.error('Failed to submit review');
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="Reviews & Ratings" description="Rate your completed services" />
      <Card className="p-6">
        <h3 className="font-semibold">Select a Booking to Review</h3>
        {isLoading ? (
          <p className="py-4 text-sm text-slate-500">Loading bookings...</p>
        ) : !bookings?.length ? (
          <p className="py-4 text-sm text-slate-500">No completed bookings pending review.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {bookings.map((b: { _id: string; service?: { name?: string }; bookingId?: string; completedAt?: string }) => (
              <button
                key={b._id}
                onClick={() => setSelectedBooking(b._id)}
                className={`w-full rounded-lg border p-3 text-left ${selectedBooking === b._id ? 'border-brand-orange bg-orange-50' : 'border-slate-200'}`}
              >
                <p className="font-medium text-sm">{b.service?.name || 'Service'}</p>
                <p className="text-xs text-slate-500">#{b.bookingId} · {b.completedAt ? new Date(b.completedAt).toLocaleDateString('en-IN') : ''}</p>
              </button>
            ))}
          </div>
        )}
        {selectedBooking && (
          <>
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)}>
                  <Star className={`h-8 w-8 ${n <= rating ? 'fill-brand-orange text-brand-orange' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
            <textarea
              className="mt-4 w-full rounded-xl border p-3 text-sm"
              rows={4}
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button className="mt-4" onClick={submit}>Submit Review</Button>
          </>
        )}
      </Card>
    </div>
  );
}
