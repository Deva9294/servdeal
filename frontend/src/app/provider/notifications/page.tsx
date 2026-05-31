'use client';

import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

export default function ProviderNotificationsPage() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['provider-notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return (res.data.data || []) as NotificationItem[];
    },
  });

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Notifications</h1>
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      )}
      {!isLoading && (!notifications || notifications.length === 0) && (
        <Card className="p-8 text-center text-slate-500">
          <Bell className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2">No notifications yet</p>
        </Card>
      )}
      {!isLoading && notifications && notifications.map((n) => (
        <Card key={n._id} className={`flex gap-4 p-4 border-l-4 ${n.isRead ? 'border-l-slate-300 bg-slate-50' : 'border-l-brand-orange'}`}>
          <Bell className="h-5 w-5 text-brand-orange shrink-0" />
          <div>
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-slate-600">{n.message}</p>
            <p className="text-xs text-slate-400">{formatTime(n.createdAt)}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
