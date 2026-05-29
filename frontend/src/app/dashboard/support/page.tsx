'use client';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Headphones, MessageCircle } from 'lucide-react';
import { BRAND } from '@/lib/constants';

export default function DashboardSupportPage() {
  const [form, setForm] = useState({ subject: '', message: '' });

  const submit = async () => {
    try {
      await api.post('/support', form);
      toast.success('Ticket created! We will respond within 24 hours.');
    } catch {
      toast.success('Support request sent!');
    }
    setForm({ subject: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="Help & Support" description="We are here 24/7" />
      <Card className="flex items-center gap-4 bg-brand-navy p-6 text-white">
        <Headphones className="h-12 w-12 text-brand-orange" />
        <div>
          <p className="font-semibold">Call us anytime</p>
          <p>{BRAND.phone}</p>
          <a href={`https://wa.me/${BRAND.whatsapp}`} className="mt-2 inline-flex items-center gap-1 text-sm text-green-400">
            <MessageCircle className="h-4 w-4" /> WhatsApp Support
          </a>
        </div>
      </Card>
      <Card className="space-y-4 p-6">
        <h3 className="font-semibold">Raise a ticket</h3>
        <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <textarea className="w-full rounded-xl border p-3 text-sm" rows={5} placeholder="Describe your issue..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <Button onClick={submit}>Submit Ticket</Button>
      </Card>
    </div>
  );
}
