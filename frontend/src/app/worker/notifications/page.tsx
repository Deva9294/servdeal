'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import { Bell, CheckCircle, Trash2 } from 'lucide-react';

type Notification = {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: string;
};

export default function WorkerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then((res) => setNotifications(res.data.notifications || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch { /* ignore */ }
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch { /* ignore */ }
  };

  const clearAll = () => setNotifications([]);

  if (loading) return <p className="text-sm text-slate-500">Loading notifications...</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-navy">Notifications</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCircle className="mr-1 h-4 w-4" /> Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            <Trash2 className="mr-1 h-4 w-4" /> Clear
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <Card
            key={n._id}
            className={`p-4 cursor-pointer transition hover:shadow-sm ${n.read ? 'opacity-70' : 'border-l-4 border-l-brand-orange'}`}
          >
            <div className="flex items-start gap-3" onClick={() => markRead(n._id)}>
              <Bell className={`mt-0.5 h-5 w-5 ${n.read ? 'text-slate-400' : 'text-brand-orange'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-sm text-slate-600">{n.message}</p>
                <p className="mt-1 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-brand-orange" />}
            </div>
          </Card>
        ))}
        {notifications.length === 0 && (
          <Card className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-slate-500">No notifications.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
