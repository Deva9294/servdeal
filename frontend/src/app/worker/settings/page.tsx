'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Lock, Bell, Moon, Globe, Save } from 'lucide-react';

export default function WorkerSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [saving, setSaving] = useState(false);

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please fill both fields');
      return;
    }
    setSaving(true);
    try {
      await api.patch('/users/me/password', { currentPassword, newPassword });
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-xl font-bold text-brand-navy">Settings</h2>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-brand-navy flex items-center gap-2"><Lock className="h-5 w-5 text-brand-orange" /> Change Password</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <Button onClick={changePassword} disabled={saving} className="bg-brand-orange hover:bg-brand-orange/90">
          <Save className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Update Password'}
        </Button>
      </Card>

      <Card className="p-6 space-y-5">
        <h3 className="font-semibold text-brand-navy flex items-center gap-2"><Bell className="h-5 w-5 text-brand-orange" /> Notifications</h3>
        <Toggle label="Email Notifications" checked={emailNotifications} onChange={setEmailNotifications} />
        <Toggle label="SMS Notifications" checked={smsNotifications} onChange={setSmsNotifications} />
      </Card>

      <Card className="p-6 space-y-5">
        <h3 className="font-semibold text-brand-navy flex items-center gap-2"><Moon className="h-5 w-5 text-brand-orange" /> Appearance</h3>
        <Toggle label="Dark Mode" checked={darkMode} onChange={setDarkMode} />
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-brand-navy flex items-center gap-2"><Globe className="h-5 w-5 text-brand-orange" /> Language</h3>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </Card>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700">{label}</span>
      <label className="relative inline-flex cursor-pointer items-center">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-brand-orange after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
      </label>
    </div>
  );
}
