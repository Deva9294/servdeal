'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star } from 'lucide-react';

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Review Moderation</h1>
      {[
        { user: 'Aman', service: 'AC Repair', rating: 5, text: 'Great service!', flagged: false },
        { user: 'Unknown', service: 'Plumbing', rating: 1, text: 'Spam content...', flagged: true },
      ].map((r, i) => (
        <Card key={i} className={`p-4 ${r.flagged ? 'border-red-300' : ''}`}>
          <div className="flex justify-between">
            <p className="font-semibold">{r.user} · {r.service}</p>
            <div className="flex gap-1">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-brand-orange text-brand-orange" />)}</div>
          </div>
          <p className="mt-2 text-sm text-slate-600">{r.text}</p>
          {r.flagged && <div className="mt-3 flex gap-2"><Button size="sm" variant="outline">Hide</Button><Button size="sm">Approve</Button></div>}
        </Card>
      ))}
    </div>
  );
}
