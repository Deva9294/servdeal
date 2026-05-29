'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ProviderAvailabilityPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">My Availability</h1>
      <Card className="space-y-4 p-6">
        {days.map((day) => (
          <div key={day} className="flex items-center justify-between border-b pb-3">
            <span className="font-medium">{day}</span>
            <div className="flex items-center gap-3">
              <select className="rounded-lg border px-2 py-1 text-sm">
                <option>9 AM - 6 PM</option>
                <option>10 AM - 8 PM</option>
                <option>Off</option>
              </select>
              <input type="checkbox" defaultChecked={day !== 'Sunday'} className="accent-brand-orange" />
            </div>
          </div>
        ))}
        <Button className="w-full">Save Availability</Button>
      </Card>
    </div>
  );
}
