'use client';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from 'next-themes';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
import { Moon, Sun, Bell, Globe, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="Settings" description="Preferences and account security" />
      <Card className="divide-y">
        <button className="flex w-full items-center justify-between p-4" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <span className="flex items-center gap-3"><Moon className="h-5 w-5" /> Dark Mode</span>
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <div className="flex items-center justify-between p-4">
          <span className="flex items-center gap-3"><Bell className="h-5 w-5" /> Push Notifications</span>
          <input type="checkbox" defaultChecked className="h-5 w-5 accent-brand-orange" />
        </div>
        <div className="flex items-center justify-between p-4">
          <span className="flex items-center gap-3"><Globe className="h-5 w-5" /> Language</span>
          <select className="rounded-lg border px-2 py-1 text-sm">
            <option>English</option>
            <option>हिंदी</option>
          </select>
        </div>
        <LinkRow icon={Shield} label="Privacy & Security" href="/privacy" />
      </Card>
      <Button variant="outline" className="w-full text-red-600 border-red-200" onClick={handleLogout}>Logout</Button>
    </div>
  );
}

function LinkRow({ icon: Icon, label, href }: { icon: typeof Shield; label: string; href: string }) {
  return (
    <a href={href} className="flex items-center gap-3 p-4 hover:bg-slate-50">
      <Icon className="h-5 w-5" />
      {label}
    </a>
  );
}
