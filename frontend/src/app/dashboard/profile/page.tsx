'use client';

import dynamic from 'next/dynamic';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/store/authSlice';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const LocationMap = dynamic(() => import('@/components/maps/LocationMap'), { ssr: false });

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string>('');
  const [uploading, setUploading] = useState(false);
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
      setAvatar(user.avatar || '');
      if (user.location) setPosition([user.location.lat, user.location.lng]);
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.');
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const { data } = await api.post('/users/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatar(data.avatar);
      dispatch(updateUser({ avatar: data.avatar }));
      toast.success('Photo updated!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

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
        {avatar ? (
          <img src={avatar} alt="avatar" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange text-2xl font-bold text-white">
            {form.name[0]}
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Change Photo'}
        </Button>
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
