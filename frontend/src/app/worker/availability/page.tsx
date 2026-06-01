'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Clock, CheckCircle } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WorkerAvailabilityPage() {
  const [available, setAvailable] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [saving, setSaving] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const saveAvailability = async () => {
    setSaving(true);
    try {
      await api.patch('/workers/me', {
        availability: {
          isAvailable: available,
          days: selectedDays,
          hours: { start: startTime, end: endTime },
        },
      });
      toast.success('Availability updated');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-xl font-bold text-brand-navy">My Availability</h2>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-brand-orange" />
            <div>
              <h3 className="font-semibold">Available for work</h3>
              <p className="text-sm text-slate-500">Toggle to go offline</p>
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-brand-orange after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
          </label>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <h3 className="font-semibold text-brand-navy">Working Days</h3>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const active = selectedDays.includes(day);
            return (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? 'border-brand-orange bg-orange-50 text-brand-orange font-medium'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <h3 className="font-semibold text-brand-navy">Working Hours</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-600">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
            />
          </div>
        </div>

        <Button onClick={saveAvailability} disabled={saving} className="bg-brand-orange hover:bg-brand-orange/90">
          <CheckCircle className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Availability'}
        </Button>
      </Card>
    </div>
  );
}
