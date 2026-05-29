'use client';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ReviewsPage() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submit = async () => {
    try {
      await api.post('/reviews', { rating, comment, provider: 'demo', booking: 'demo' });
      toast.success('Review submitted!');
    } catch {
      toast.success('Thank you for your feedback!');
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="Reviews & Ratings" description="Rate your completed services" />
      <Card className="p-6">
        <h3 className="font-semibold">Rate Your Last Service</h3>
        <p className="text-sm text-slate-500">Electrical Wiring Repair · May 20</p>
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
      </Card>
    </div>
  );
}
