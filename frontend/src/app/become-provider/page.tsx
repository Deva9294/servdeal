import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Wallet, Calendar, BadgeCheck, Smartphone, TrendingUp, Headphones } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Become a Provider',
  description: 'Join ServDeal as a verified service partner. Earn more bookings with transparent payouts and training.',
};

const benefits = [
  { icon: TrendingUp, title: 'More Customers', desc: 'Get discovered by thousands of homeowners searching daily in your city.' },
  { icon: Wallet, title: 'Weekly Payouts', desc: 'Direct UPI transfers with clear commission — no chasing payments.' },
  { icon: Calendar, title: 'Your Schedule', desc: 'Accept jobs when you are free. Pause availability during festivals or leave.' },
  { icon: BadgeCheck, title: 'Trust Badge', desc: 'Verified ID and skills badge helps you win higher-value bookings.' },
  { icon: Smartphone, title: 'Partner App', desc: 'Manage jobs, navigation, and earnings from one simple dashboard.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'Onboarding help, dispute resolution, and safety guidelines in Hindi & English.' },
];

const steps = [
  'Register with phone and basic details',
  'Upload Aadhaar, photo, and skill certificates',
  'Complete a short training module online',
  'Start receiving bookings in your service area',
];

export default function BecomeProviderPage() {
  return (
    <PublicLayout>
      <PageHero
        title="Grow Your Business with"
        highlight="ServDeal"
        description="Join 2,500+ verified plumbers, electricians, cleaners, and technicians earning steady income across Bihar and beyond."
      >
        <Link href="/provider/onboarding" className="mt-8 inline-block">
          <Button size="lg">Start Registration</Button>
        </Link>
      </PageHero>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="text-center text-2xl font-bold text-brand-navy">Why partners choose us</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <Card key={b.title} className="p-6">
                <b.icon className="h-10 w-10 text-brand-orange" />
                <h3 className="mt-4 font-semibold text-brand-navy">{b.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{b.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-center">Onboarding in 4 steps</h2>
          <ol className="mt-10 space-y-4">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-xl bg-white/10 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange font-bold">
                  {i + 1}
                </span>
                <span className="pt-2">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link href="/login?role=provider">
              <Button variant="secondary" size="lg">
                Already a partner? Log in
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
