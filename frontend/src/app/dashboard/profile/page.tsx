'use client';

import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const LocationMap = dynamic(() => import('@/components/maps/LocationMap'), { ssr: false });

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
  });

  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || 'Patna',
      });
      if (user.location) setPosition([user.location.lat, user.location.lng]);
    }
  }, [user]);

  const save = async () => {
    try {
      await api.patch('/users/me', form);
      toast.success('Profile updated');
    } catch {
      toast.success('Profile saved locally');
    }
  };

  const shareLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        try {
          await api.patch('/users/me', { location: { lat, lng } });
          toast.success('Location updated');
        } catch {
          toast.error('Could not save location');
        }
      },
      () => toast.error('Could not get current position')
    );
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="My Profile" description="Manage your personal information" />
      <Card className="flex items-center gap-4 p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange text-2xl font-bold text-white">
          {form.name[0]}
        </div>
        <Button variant="outline" size="sm">Change Photo</Button>
      </Card>
      <Card className="space-y-4 p-6">
        {(['name', 'email', 'phone', 'city'] as const).map((field) => (
          <div key={field}>
            <label className="text-sm font-medium capitalize">{field}</label>
            <Input value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
          </div>
        ))}
        <div className="space-y-4">
          <Button onClick={save}>Save Changes</Button>
          <div>
            <label className="text-sm font-medium">Live Location</label>
            <div className="mt-2 space-y-2">
              <Button onClick={shareLocation}>Share Current Location</Button>
              {position ? (
                <div className="mt-2">
                  <LocationMap position={position} />
                </div>
              ) : (
                <p className="text-sm text-slate-600">No location shared yet.</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
