import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Shield, CreditCard, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Book verified home service professionals in 4 simple steps with ServDeal.',
};

const features = [
  { icon: Shield, title: 'Verified Professionals', desc: 'Police verification and skill assessment for every partner.' },
  { icon: CreditCard, title: 'Secure Payments', desc: 'Pay via UPI, card, or wallet. No cash pressure at your door.' },
  { icon: Clock, title: 'Flexible Scheduling', desc: 'Same-day slots in most areas. Reschedule free up to 2 hours before.' },
  { icon: MapPin, title: 'Live in Your City', desc: 'Hyperlocal matching so pros arrive faster with lower travel charges.' },
];

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <PageHero
        title="How"
        highlight="It Works"
        description="From choosing your service to job completion — ServDeal keeps every step simple, transparent, and safe for Indian households."
      />
      <HowItWorks />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="text-center text-2xl font-bold text-brand-navy">Why customers trust the process</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title} className="p-6 text-center">
                <f.icon className="mx-auto h-10 w-10 text-brand-orange" />
                <h3 className="mt-4 font-semibold text-brand-navy">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </Card>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/services">
              <Button size="lg">Book a Service</Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary" size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
