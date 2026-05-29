import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BRAND } from '@/lib/constants';
import { MessageCircle, Phone, FileText, HelpCircle } from 'lucide-react';

export const metadata: Metadata = { title: 'Support' };

const channels = [
  { icon: MessageCircle, title: 'Live Chat', desc: 'Available 8 AM – 10 PM IST on website and app.', href: '#' },
  { icon: Phone, title: 'Phone Support', desc: BRAND.phone, href: `tel:${BRAND.phone.replace(/\s/g, '')}` },
  { icon: HelpCircle, title: 'Help Center', desc: 'Guides for bookings, payments, and account.', href: '/help' },
  { icon: FileText, title: 'FAQs', desc: 'Quick answers to common questions.', href: '/faqs' },
];

export default function SupportPage() {
  return (
    <PublicLayout>
      <PageHero title="Customer" highlight="Support" description="We are here to help with bookings, payments, and service quality — in Hindi and English." />

      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {channels.map((c) => (
              <Link key={c.title} href={c.href}>
                <Card className="flex gap-4 p-6 transition hover:border-brand-orange/40">
                  <c.icon className="h-8 w-8 text-brand-orange" />
                  <div>
                    <h2 className="font-semibold text-brand-navy">{c.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="mt-10 p-8 text-center">
            <h2 className="text-lg font-bold text-brand-navy">Active booking issue?</h2>
            <p className="mt-2 text-sm text-slate-600">Open your dashboard for real-time job status and chat with assigned Partner.</p>
            <Link href="/dashboard" className="mt-4 inline-block">
              <Button>Go to Dashboard</Button>
            </Link>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
