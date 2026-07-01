'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface ProviderSettings {
  notificationSound: boolean;
  autoAcceptBookings: boolean;
  navigationApp: string;
}

export default function ProviderSettingsPage() {
  const { logout } = useAuth();
  const [settings, setSettings] = useState<ProviderSettings>({
    notificationSound: true,
    autoAcceptBookings: false,
    navigationApp: 'google-maps',
  });
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await api.get('/providers/settings');
      setSettings(s => ({ ...s, ...data.data }));
    } catch {
      // Use defaults
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      await api.patch('/providers/settings', settings);
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof ProviderSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">Settings</h1>
      <Card className="divide-y">
        <div className="flex justify-between p-4">
          <span>Notification sound</span>
          <input 
            type="checkbox" 
            checked={settings.notificationSound}
            onChange={(e) => updateSetting('notificationSound', e.target.checked)}
            className="accent-brand-orange" 
          />
        </div>
        <div className="flex justify-between p-4">
          <span>Auto-accept bookings</span>
          <input 
            type="checkbox" 
            checked={settings.autoAcceptBookings}
            onChange={(e) => updateSetting('autoAcceptBookings', e.target.checked)}
            className="accent-brand-orange" 
          />
        </div>
        <div className="flex justify-between p-4">
          <span>Navigation app</span>
          <select 
            className="border rounded-lg px-2 text-sm"
            value={settings.navigationApp}
            onChange={(e) => updateSetting('navigationApp', e.target.value)}
          >
            <option value="google-maps">Google Maps</option>
            <option value="waze">Waze</option>
            <option value="apple-maps">Apple Maps</option>
          </select>
        </div>
      </Card>
      <div className="flex gap-3">
        <Button onClick={saveSettings} disabled={saving} className="flex-1">
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
        <Link href="/provider/onboarding" className="flex-1">
          <Button variant="outline" className="w-full">Update Documents</Button>
        </Link>
      </div>
      <Button variant="outline" className="w-full text-red-600 border-red-200" onClick={logout}>Logout</Button>
    </div>
  );
}
