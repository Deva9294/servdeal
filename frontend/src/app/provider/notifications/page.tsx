'use client';

import { Card } from '@/components/ui/Card';
import { Bell } from 'lucide-react';

const items = [
  { title: 'New Booking Request', msg: 'Electrical wiring at Patna - 10 AM tomorrow', time: '2 min ago' },
  { title: 'Payout Processed', msg: '₹3,250 transferred to your bank', time: '1 day ago' },
];

export default function ProviderNotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Notifications</h1>
      {items.map((n, i) => (
        <Card key={i} className="flex gap-4 p-4 border-l-4 border-l-brand-orange">
          <Bell className="h-5 w-5 text-brand-orange" />
          <div>
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-slate-600">{n.msg}</p>
            <p className="text-xs text-slate-400">{n.time}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
