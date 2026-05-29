'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ProviderSettingsPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Settings</h1>
      <Card className="divide-y">
        <div className="flex justify-between p-4"><span>Notification sound</span><input type="checkbox" defaultChecked className="accent-brand-orange" /></div>
        <div className="flex justify-between p-4"><span>Auto-accept bookings</span><input type="checkbox" className="accent-brand-orange" /></div>
        <div className="flex justify-between p-4"><span>Navigation app</span><select className="border rounded-lg px-2 text-sm"><option>Google Maps</option></select></div>
      </Card>
      <Link href="/provider/onboarding"><Button variant="outline" className="w-full">Update Documents</Button></Link>
    </div>
  );
}
