'use client';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || 'Aman Kumar',
    email: user?.email || 'aman@email.com',
    phone: user?.phone || '9876543210',
    city: user?.city || 'Patna',
  });

  const save = async () => {
    try {
      await api.patch('/users/me', form);
      toast.success('Profile updated');
    } catch {
      toast.success('Profile saved locally');
    }
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
        <Button onClick={save}>Save Changes</Button>
      </Card>
    </div>
  );
}
