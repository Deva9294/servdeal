'use client';

import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { Bell, Loader2 } from 'lucide-react';

export default function NotificationsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data.data || [];
    },
  });

  return (
    <div>
      <PageHeader title="Notifications" description="Stay updated on bookings and offers" />
      <div className="space-y-3">
        {isLoading && <div className="flex items-center gap-2 py-10 text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /> Loading...</div>}
        {!isLoading && !(data || []).length && <p className="py-10 text-center text-slate-500">No notifications yet</p>}
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
