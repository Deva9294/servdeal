'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const pages = ['Home Banner', 'About Us', 'Terms', 'Privacy', 'FAQ Section'];

export default function AdminCMSPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-navy">CMS Editor</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold">Pages</h3>
          <ul className="mt-4 space-y-2">
            {pages.map((p) => (
              <li key={p}><button className="w-full rounded-lg border p-3 text-left text-sm hover:border-brand-orange">{p}</button></li>
            ))}
          </ul>
        </Card>
        <Card className="space-y-4 p-5">
          <h3 className="font-semibold">Edit Content</h3>
          <Input placeholder="Page title" defaultValue="Home Banner" />
          <Input placeholder="Meta title" />
          <textarea className="w-full rounded-xl border p-3 text-sm" rows={6} placeholder="HTML content..." />
          <Input placeholder="Banner image URL" />
          <Button>Save Changes</Button>
        </Card>
      </div>
    </div>
  );
}
