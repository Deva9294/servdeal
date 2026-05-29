'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

type Address = { id: string; label: string; line1: string; city: string; pincode: string; isDefault: boolean };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', label: 'Home', line1: '123 MG Road, Boring Road', city: 'Patna', pincode: '800001', isDefault: true },
    { id: '2', label: 'Office', line1: '45 Fraser Road', city: 'Patna', pincode: '800001', isDefault: false },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: 'Home', line1: '', city: 'Patna', pincode: '' });

  const addAddress = () => {
    if (!form.line1) return toast.error('Enter address');
    setAddresses([...addresses, { ...form, id: Date.now().toString(), isDefault: false }]);
    setShowForm(false);
    toast.success('Address added');
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

      {addresses.map((a) => (
        <Card key={a.id} className="flex items-start gap-4 p-5">
          <MapPin className="h-6 w-6 text-brand-orange shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{a.label}</p>
              {a.isDefault && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Default</span>}
            </div>
            <p className="text-sm text-slate-600">{a.line1}, {a.city} - {a.pincode}</p>
          </div>
          <button onClick={() => setAddresses(addresses.filter((x) => x.id !== a.id))} className="text-slate-400 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </Card>
      ))}
    </div>
  );
}
