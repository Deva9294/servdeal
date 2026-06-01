'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { Star, User } from 'lucide-react';

type Review = {
  _id: string;
  rating: number;
  comment?: string;
  customerName?: string;
  createdAt?: string;
};

export default function WorkerReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    api.get('/workers/reviews')
      .then((res) => {
        setReviews(res.data.reviews || []);
        setAvg(res.data.averageRating || 0);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-slate-500">Loading reviews...</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h2 className="text-xl font-bold text-brand-navy">My Reviews</h2>

      <Card className="p-6 flex items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10">
          <span className="text-3xl font-bold text-brand-orange">{avg.toFixed(1)}</span>
        </div>
        <div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-5 w-5 ${s <= Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
            ))}
          </div>
          <p className="mt-1 text-sm text-slate-500">{reviews.length} reviews</p>
        </div>
      </Card>

      <div className="space-y-4">
        {reviews.map((r) => (
          <Card key={r._id} className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <User className="h-5 w-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium">{r.customerName || 'Customer'}</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3 w-3 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                  ))}
                </div>
              </div>
              <span className="ml-auto text-xs text-slate-400">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</span>
            </div>
            <p className="mt-3 text-sm text-slate-700">{r.comment || 'No comment.'}</p>
          </Card>
        ))}
        {reviews.length === 0 && (
          <Card className="p-8 text-center">
            <Star className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-slate-500">No reviews yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
