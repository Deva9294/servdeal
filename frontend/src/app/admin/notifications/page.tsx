'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminNotificationsPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Push Notifications</h1>
      <Card className="space-y-4 p-6">
        <Input placeholder="Notification title" />
        <textarea className="w-full rounded-xl border p-3 text-sm" rows={4} placeholder="Message..." />
        <select className="w-full rounded-xl border p-3 text-sm">
          <option>All Users</option>
          <option>Customers Only</option>
          <option>Providers Only</option>
          <option>Patna City</option>
        </select>
        <Button className="w-full">Send Notification</Button>
      </Card>
    </div>
  );
}
