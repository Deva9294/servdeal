'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star } from 'lucide-react';

export default function ProviderProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">My Profile</h1>
      <Card className="flex items-center gap-6 p-6">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-navy text-3xl text-white">R</div>
          <Badge status="active" className="absolute -bottom-1 left-1/2 -translate-x-1/2">Online</Badge>
        </div>
        <div>
          <h2 className="text-xl font-bold">Rohit Kumar</h2>
          <p className="text-slate-500">Electrician</p>
          <p className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-brand-orange text-brand-orange" /> 4.8 (245 reviews)</p>
        </div>
      </Card>
      <Card className="space-y-4 p-6">
        <Input defaultValue="Rohit Kumar" placeholder="Full name" />
        <Input defaultValue="rohit@email.com" placeholder="Email" />
        <Input defaultValue="9876543210" placeholder="Phone" />
        <textarea className="w-full rounded-xl border p-3 text-sm" rows={3} defaultValue="10+ years experience in residential and commercial electrical work." />
        <Button>Save Profile</Button>
      </Card>
      <Card className="p-6">
        <h3 className="font-semibold">Verification Documents</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {['Aadhaar', 'PAN', 'Skill Certificate'].map((d) => (
            <div key={d} className="rounded-xl border border-dashed p-4 text-center text-sm">
              <p className="font-medium">{d}</p>
              <Button variant="outline" size="sm" className="mt-2">Upload</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
