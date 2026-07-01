'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export default function ProviderAvailabilityPage() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const { data } = await api.get('/providers/availability');
      setSlots(data.data || days.map(day => ({ day, startTime: '09:00', endTime: '18:00', isAvailable: day !== 'Sunday' })));
    } catch {
      setSlots(days.map(day => ({ day, startTime: '09:00', endTime: '18:00', isAvailable: day !== 'Sunday' })));
    } finally {
      setLoading(false);
    }
  };

  const updateSlot = (day: string, field: keyof AvailabilitySlot, value: string | boolean) => {
    setSlots(prev => prev.map(s => s.day === day ? { ...s, [field]: value } : s));
  };

  const saveAvailability = async () => {
    setSaving(true);
    try {
      await api.patch('/providers/availability', { slots });
      toast.success('Availability saved successfully');
    } catch {
      toast.error('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-2xl font-bold text-brand-navy">My Availability</h1>
        <Card className="space-y-4 p-6">
          {days.map(() => <Skeleton key={Math.random()} className="h-12" />)}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">My Availability</h1>
      <Card className="space-y-4 p-6">
        {slots.map((slot) => (
          <div key={slot.day} className="flex items-center justify-between border-b pb-3">
            <span className="font-medium">{slot.day}</span>
            <div className="flex items-center gap-3">
              <select 
                className="rounded-lg border px-2 py-1 text-sm"
                value={`${slot.startTime}-${slot.endTime}`}
                onChange={(e) => {
                  const [start, end] = e.target.value.split('-');
                  updateSlot(slot.day, 'startTime', start);
                  updateSlot(slot.day, 'endTime', end);
                }}
                disabled={!slot.isAvailable}
              >
                <option value="09:00-18:00">9 AM - 6 PM</option>
                <option value="10:00-20:00">10 AM - 8 PM</option>
                <option value="08:00-17:00">8 AM - 5 PM</option>
              </select>
              <input 
                type="checkbox" 
                checked={slot.isAvailable} 
                onChange={(e) => updateSlot(slot.day, 'isAvailable', e.target.checked)}
                className="accent-brand-orange" 
              />
            </div>
          </div>
        ))}
        <Button className="w-full" onClick={saveAvailability} disabled={saving}>
          {saving ? 'Saving...' : 'Save Availability'}
        </Button>
      </Card>
    </div>
  );
}
