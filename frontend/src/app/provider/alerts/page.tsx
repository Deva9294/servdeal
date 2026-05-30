'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import { SkeletonPulse } from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface JobAlert {
  _id: string;
  booking: {
    bookingId: string;
    service: { name: string };
    amount: number;
    address: { city: string };
    scheduledAt: string;
  };
  distanceKm: number;
  matchScore: number;
  status: string;
  expiresAt: string;
}

export default function JobAlertsPage() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data } = await api.get('/job-alerts/me');
      setAlerts(data.alerts || []);
    } catch {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const respond = async (id: string, action: 'accept' | 'decline') => {
    try {
      await api.post(`/job-alerts/${id}/respond`, { action });
      toast.success(action === 'accept' ? 'Job accepted!' : 'Job declined');
      fetchAlerts();
    } catch {
      toast.error('Failed to respond');
    }
  };

  if (loading) return <SkeletonPulse />;

  const pending = alerts.filter((a) => a.status === 'pending');

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Nearby Job Alerts" description="AI-matched jobs near your location" />

      {pending.length === 0 ? (
        <EmptyState icon={Clock} title="No Job Alerts" description="No pending job alerts right now. Check back soon!" />
      ) : (
        <div className="space-y-4">
          {pending.map((alert) => (
            <Card key={alert._id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-orange px-2 py-0.5 text-xs font-bold text-white">{alert.matchScore}% Match</span>
                    <span className="text-xs text-slate-500"><MapPin className="inline h-3 w-3" /> {alert.distanceKm} km</span>
                  </div>
                  <h3 className="mt-1 font-bold text-brand-navy">{alert.booking.service?.name}</h3>
                  <p className="text-sm text-slate-500">Booking #{alert.booking.bookingId} • {alert.booking.address?.city}</p>
                  <p className="mt-1 text-lg font-bold text-brand-orange">₹{alert.booking.amount}</p>
                  <p className="text-xs text-slate-400">Expires in {Math.max(0, Math.ceil((new Date(alert.expiresAt).getTime() - Date.now()) / 60000))} min</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => respond(alert._id, 'accept')}><CheckCircle className="h-4 w-4 mr-1" /> Accept</Button>
                  <Button variant="outline" onClick={() => respond(alert._id, 'decline')}><XCircle className="h-4 w-4 mr-1" /> Decline</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
