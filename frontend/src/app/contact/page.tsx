'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BRAND } from '@/lib/constants';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await new Promise((r) => setTimeout(r, 800));
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <PublicLayout>
      <PageHero
        title="Contact"
        highlight="Us"
        description="Questions about bookings, partnerships, or media? Our Patna support team responds within 24 hours on business days."
      />

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-4">
              {[
                { icon: Phone, label: 'Phone', value: 919294899787 },
                { icon: Mail, label: 'Email', value: BRAND.email },
                { icon: MapPin, label: 'Office', value: `Village Itarsi, Rehti, Sehore, M.P. India 466446, ${BRAND.defaultCity}` },
                {
                  icon: MessageCircle,
                  label: 'WhatsApp',
                  value: 'Chat with us',
                  href: `https://wa.me/${BRAND.whatsapp}`,
                },
              ].map((item) => (
                <Card key={item.label} className="flex gap-4 p-5">
                  <item.icon className="h-6 w-6 shrink-0 text-brand-orange" />
                  <div>
                    <p className="text-sm font-semibold text-brand-navy">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-orange hover:underline">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-slate-600">{item.value}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Card className="lg:col-span-2 p-8">
              <h2 className="text-xl font-bold text-brand-navy">Send a message</h2>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                    <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
                    <Input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Subject</label>
                  <Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Booking help, partnership, etc." />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                {status === 'success' && (
                  <p className="text-sm font-medium text-green-600">Thank you! We have received your message and will reply soon.</p>
                )}
                {status === 'error' && (
                  <p className="text-sm font-medium text-red-600">Something went wrong. Please try WhatsApp or call us directly.</p>
                )}
                <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto">
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
