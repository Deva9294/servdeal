'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SERVICES } from '@/data/services';
import { ServiceIcon } from '@/components/services/ServiceIcon';

export default function ProviderServicesPage() {
  const myServices = SERVICES.filter((s) => ['electrician', 'appliance-repair'].includes(s.slug));

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">My Services</h1>
        <Button>+ Add Service</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {myServices.map((s) => (
          <Card key={s.slug} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <ServiceIcon name={s.icon} className={s.color} />
              <span className="font-medium">{s.name}</span>
            </div>
            <label className="relative inline-flex cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="h-6 w-11 rounded-full bg-green-500 peer" />
            </label>
          </Card>
        ))}
      </div>
      <Card className="p-4">
        <p className="text-sm text-slate-500">Service radius: <strong>10 km</strong> from Patna center</p>
        <Button variant="outline" size="sm" className="mt-2">Edit Service Area</Button>
      </Card>
    </div>
  );
}
