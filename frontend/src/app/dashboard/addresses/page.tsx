'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MapPin, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AddressesPage() {
  const qc = useQueryClient();
  const { data: addresses, isLoading } = useQuery({
    queryKey: ['my-addresses'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return (res.data.user?.addresses || []) as Array<{ _id: string; label: string; line1: string; city: string; pincode: string; isDefault: boolean }>;
    },
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: 'Home', line1: '', city: 'Patna', pincode: '' });

  const addAddress = async () => {
    if (!form.line1) return toast.error('Enter address');
    try {
      await api.post('/users/addresses', form);
      toast.success('Address added');
      setShowForm(false);
      qc.invalidateQueries({ queryKey: ['my-addresses'] });
    } catch {
      toast.error('Could not add address');
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="My Addresses" description="Saved locations for faster booking" />
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4" /> Add</Button>
      </div>

      {showForm && (
        <Card className="space-y-3 p-5">
          <Input placeholder="Label (Home/Office)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <Input placeholder="Full address" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
          </div>
          <Button onClick={addAddress}>Save Address</Button>
        </Card>
      )}

      {isLoading ? <Skeleton className="h-24" /> : (
        (addresses || []).map((a) => (
          <Card key={a._id} className="flex items-start gap-4 p-5">
            <MapPin className="h-6 w-6 text-brand-orange shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{a.label}</p>
                {a.isDefault && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Default</span>}
              </div>
              <p className="text-sm text-slate-600">{a.line1}, {a.city} - {a.pincode}</p>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
