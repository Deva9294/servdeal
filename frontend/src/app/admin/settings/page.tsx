'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SuperAdminSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brand-navy">Platform Settings (Super Admin)</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Multi-City Management</h3>
          <Input placeholder="City name" />
          <Input placeholder="State" />
          <Button>Add City</Button>
        </Card>
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Payment Settings</h3>
          <Input placeholder="PayU Key" />
          <Input placeholder="PayU Salt" type="password" />
          <Input placeholder="Stripe Secret" type="password" />
          <Input placeholder="Platform Commission %" defaultValue="15" />
          <Button>Save Settings</Button>
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
