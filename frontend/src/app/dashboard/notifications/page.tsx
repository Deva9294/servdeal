'use client';

import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const res = await api.get('/notifications');
        return res.data.data;
      } catch {
        return [
          { title: 'Booking Confirmed', message: 'Your electrician visit is confirmed for tomorrow 10 AM', isRead: false, createdAt: new Date() },
          { title: 'FLAT ₹100 OFF', message: 'Use WELCOME100 on your next booking', isRead: false, createdAt: new Date() },
          { title: 'Service Completed', message: 'Rate your AC repair experience', isRead: true, createdAt: new Date() },
        ];
      }
    },
  });

  return (
    <div>
      <PageHeader title="Notifications" description="Stay updated on bookings and offers" />
      <div className="space-y-3">
        {(data || []).map((n: { title: string; message: string; isRead: boolean; createdAt: string }, i: number) => (
          <Card key={i} className={`flex gap-4 p-4 ${!n.isRead ? 'border-l-4 border-l-brand-orange' : ''}`}>
            <Bell className="h-5 w-5 text-brand-orange shrink-0" />
            <div>
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm text-slate-600">{n.message}</p>
              <p className="mt-1 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
