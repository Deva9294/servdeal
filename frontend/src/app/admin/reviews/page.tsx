'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminReviewsPage() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const res = await api.get('/reviews');
      return res.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Review Moderation</h1>
      {isLoading && <Skeleton className="h-24" />}
      {!isLoading && !reviews?.length && <p className="text-sm text-slate-500">No reviews yet.</p>}
      {(reviews || []).map((r: { _id: string; user: { name: string }; service: { name: string }; rating: number; comment: string; isFlagged?: boolean }, i: number) => (
        <Card key={r._id || i} className={`p-4 ${r.isFlagged ? 'border-red-300' : ''}`}>
          <div className="flex justify-between">
            <p className="font-semibold">{r.user?.name || 'Anonymous'} · {r.service?.name || 'Service'}</p>
            <div className="flex gap-1">{Array.from({ length: r.rating || 0 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-brand-orange text-brand-orange" />)}</div>
          </div>
          <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
          {r.isFlagged && <div className="mt-3 flex gap-2"><Button size="sm" variant="outline">Hide</Button><Button size="sm">Approve</Button></div>}
        </Card>
      ))}
    </div>
  );
}
