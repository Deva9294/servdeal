'use client';

import { Card } from '@/components/ui/Card';
import { TrackingMap } from '@/components/maps/TrackingMap';
import { Badge } from '@/components/ui/Badge';

export default function TrackBookingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Live Booking Tracking</h1>
        <p className="text-slate-500">Track your provider in real-time</p>
      </div>
      <Card className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Electrical Wiring Repair</p>
            <p className="text-sm text-slate-500">#BK4587 · Rohit Kumar</p>
          </div>
          <Badge status="ongoing">Ongoing</Badge>
        </div>
        <TrackingMap
          center={[25.5941, 85.1376]}
          providerPosition={[25.6, 85.15]}
          height="450px"
        />
        <p className="mt-4 text-center text-sm text-slate-500">ETA: ~15 minutes</p>
      </Card>
    </div>
  );
}
