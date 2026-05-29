import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { Card } from '@/components/ui/Card';
import { BookOpen, CreditCard, User, Wrench } from 'lucide-react';

export const metadata: Metadata = { title: 'Help Center' };

const guides = [
  {
    icon: BookOpen,
    title: 'Booking a Service',
    links: [
      { label: 'How to select the right package', href: '/how-it-works' },
      { label: 'Browse all services', href: '/services' },
      { label: 'Reschedule or cancel', href: '/refund' },
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments & Refunds',
    links: [
      { label: 'Payment methods accepted', href: '/faqs' },
      { label: 'Refund policy', href: '/refund' },
      { label: 'Wallet & coupons', href: '/faqs' },
    ],
  },
  {
    icon: User,
    title: 'Your Account',
    links: [
      { label: 'Create an account', href: '/signup' },
      { label: 'Login with OTP', href: '/otp' },
      { label: 'Reset password', href: '/forgot-password' },
    ],
  },
  {
    icon: Wrench,
    title: 'For Providers',
    links: [
      { label: 'Become a partner', href: '/become-provider' },
      { label: 'Provider login', href: '/login?role=provider' },
      { label: 'Safety guidelines', href: '/safety' },
    ],
  },
];

export default function HelpPage() {
  return (
    <PublicLayout>
      <PageHero title="Help" highlight="Center" description="Step-by-step guides to get the most out of ServDeal." />

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {guides.map((g) => (
              <Card key={g.title} className="p-6">
                <g.icon className="h-8 w-8 text-brand-orange" />
                <h2 className="mt-4 font-semibold text-brand-navy">{g.title}</h2>
                <ul className="mt-4 space-y-2">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-brand-orange hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-slate-600">
            Still stuck?{' '}
            <Link href="/support" className="font-semibold text-brand-orange hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
