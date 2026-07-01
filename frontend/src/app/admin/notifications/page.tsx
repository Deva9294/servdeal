'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState('all');
  const [sending, setSending] = useState(false);

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in title and message');
      return;
    }
    setSending(true);
    try {
      await api.post('/admin/notifications', {
        title,
        message,
        target,
      });
      toast.success('Notification sent successfully');
      setTitle('');
      setMessage('');
    } catch {
      toast.error('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Push Notifications</h1>
      <Card className="space-y-4 p-6">
        <Input 
          placeholder="Notification title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea 
          className="w-full rounded-xl border p-3 text-sm" 
          rows={4} 
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <select 
          className="w-full rounded-xl border p-3 text-sm"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        >
          <option value="all">All Users</option>
          <option value="customers">Customers Only</option>
          <option value="providers">Providers Only</option>
          <option value="patna">Patna City</option>
        </select>
        <Button className="w-full" onClick={sendNotification} disabled={sending}>
          {sending ? 'Sending...' : 'Send Notification'}
        </Button>
      </Card>
    </div>
  );
}
