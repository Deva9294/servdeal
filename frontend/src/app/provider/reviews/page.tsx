'use client';

import { Card } from '@/components/ui/Card';
import { Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  customer?: { name: string };
  createdAt: string;
}

export default function ProviderReviewsPage() {
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['provider-reviews'],
    queryFn: async () => {
      const res = await api.get('/reviews/provider');
      return res.data.data || { reviews: [], averageRating: 0, totalReviews: 0 };
    },
  });

  const reviews = reviewsData?.reviews || [];
  const averageRating = reviewsData?.averageRating || 0;
  const totalReviews = reviewsData?.totalReviews || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Reviews</h1>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : (
        <>
          <Card className="p-6 text-center">
            <p className="text-4xl font-bold text-brand-orange">{averageRating.toFixed(1)}</p>
            <div className="mt-2 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`h-5 w-5 ${n <= Math.round(averageRating) ? 'fill-brand-orange text-brand-orange' : 'text-slate-300'}`} />
              ))}
            </div>
            <p className="text-sm text-slate-500">{totalReviews} reviews</p>
          </Card>
          {reviews.length === 0 ? (
            <Card className="p-8 text-center text-slate-500">
              <p>No reviews yet. Complete jobs to get reviews from customers!</p>
            </Card>
          ) : (
            reviews.map((r: Review) => (
              <Card key={r._id} className="p-4">
                <div className="flex justify-between">
                  <p className="font-semibold">{r.customer?.name || 'Customer'}</p>
                  <p className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3 w-3 fill-brand-orange text-brand-orange" />)}
                </div>
                <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
              </Card>
            ))
          )}
        </>
      )}
    </div>
  );
}
