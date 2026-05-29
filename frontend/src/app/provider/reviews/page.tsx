'use client';

import { Card } from '@/components/ui/Card';
import { Star } from 'lucide-react';

const reviews = [
  { name: 'Aman K.', rating: 5, text: 'Very professional and on time.', date: 'May 20' },
  { name: 'Priya S.', rating: 5, text: 'Fixed the issue quickly. Fair pricing.', date: 'May 18' },
  { name: 'Ravi P.', rating: 4, text: 'Good work, slight delay due to traffic.', date: 'May 15' },
];

export default function ProviderReviewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Reviews</h1>
      <Card className="p-6 text-center">
        <p className="text-4xl font-bold text-brand-orange">4.8</p>
        <div className="mt-2 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => <Star key={n} className="h-5 w-5 fill-brand-orange text-brand-orange" />)}
        </div>
        <p className="text-sm text-slate-500">245 reviews</p>
      </Card>
      {reviews.map((r, i) => (
        <Card key={i} className="p-4">
          <div className="flex justify-between">
            <p className="font-semibold">{r.name}</p>
            <p className="text-xs text-slate-400">{r.date}</p>
          </div>
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3 w-3 fill-brand-orange text-brand-orange" />)}
          </div>
          <p className="mt-2 text-sm text-slate-600">{r.text}</p>
        </Card>
      ))}
    </div>
  );
}
