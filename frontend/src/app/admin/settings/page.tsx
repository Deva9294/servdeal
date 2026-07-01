'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface PlatformSettings {
  payuKey?: string;
  payuSalt?: string;
  stripeSecret?: string;
  commissionRate?: number;
  cities?: Array<{ name: string; state: string }>;
}

export default function SuperAdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings>({});
  const [saving, setSaving] = useState(false);
  const [newCity, setNewCity] = useState({ name: '', state: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/admin/settings');
      setSettings(data.data || {});
    } catch {
      // Use defaults
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await api.patch('/admin/settings', settings);
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addCity = () => {
    if (!newCity.name || !newCity.state) {
      toast.error('Please fill city and state');
      return;
    }
    setSettings({
      ...settings,
      cities: [...(settings.cities || []), { ...newCity }],
    });
    setNewCity({ name: '', state: '' });
  };

  const removeCity = (index: number) => {
    setSettings({
      ...settings,
      cities: settings.cities?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brand-navy">Platform Settings (Super Admin)</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Multi-City Management</h3>
          <div className="flex gap-2">
            <Input 
              placeholder="City name" 
              value={newCity.name}
              onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
            />
            <Input 
              placeholder="State" 
              value={newCity.state}
              onChange={(e) => setNewCity({ ...newCity, state: e.target.value })}
            />
            <Button onClick={addCity}>Add</Button>
          </div>
          <div className="space-y-2 mt-2">
            {settings.cities?.map((city, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                <span>{city.name}, {city.state}</span>
                <button onClick={() => removeCity(i)} className="text-red-500 hover:text-red-700">Remove</button>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Payment Settings</h3>
          <Input 
            placeholder="PayU Key" 
            value={settings.payuKey || ''}
            onChange={(e) => setSettings({ ...settings, payuKey: e.target.value })}
          />
          <Input 
            placeholder="PayU Salt" 
            type="password"
            value={settings.payuSalt || ''}
            onChange={(e) => setSettings({ ...settings, payuSalt: e.target.value })}
          />
          <Input 
            placeholder="Stripe Secret" 
            type="password"
            value={settings.stripeSecret || ''}
            onChange={(e) => setSettings({ ...settings, stripeSecret: e.target.value })}
          />
          <Input 
            placeholder="Platform Commission %" 
            type="number"
            value={settings.commissionRate || 15}
            onChange={(e) => setSettings({ ...settings, commissionRate: Number(e.target.value) })}
          />
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </Card>
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Role Permissions</h3>
          <p className="text-sm text-slate-500">Manage staff roles and API access</p>
          <Button variant="outline">Manage Staff</Button>
        </Card>
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Backup System</h3>
          <p className="text-sm text-slate-500">Schedule database backups</p>
          <Button variant="secondary">Run Backup Now</Button>
        </Card>
      </div>
    </div>
  );
}
