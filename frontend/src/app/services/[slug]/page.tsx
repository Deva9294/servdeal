import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { SERVICES, getServiceBySlug } from '@/data/services';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Star, CheckCircle2, HelpCircle } from 'lucide-react';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: 'Service Not Found' };
  return {
    title: service.name,
    description: `${service.description}. Book verified ${service.name} professionals on ServDeal from ₹${service.basePrice}.`,
  };
}

type Package = {
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
};

function getPackages(basePrice: number): Package[] {
  return [
    {
      name: 'Basic',
      price: basePrice,
      features: ['Single visit', 'Standard parts not included', '30-day service warranty'],
    },
    {
      name: 'Standard',
      price: Math.round(basePrice * 1.4),
      features: ['Priority scheduling', 'Basic spares included', '45-day warranty', 'Free re-visit if issue persists'],
      popular: true,
    },
    {
      name: 'Premium',
      price: Math.round(basePrice * 2),
      features: ['Same-day slot', 'Premium parts allowance', '90-day warranty', 'Dedicated support line'],
    },
  ];
}

const faqsByCategory: Record<string, { q: string; a: string }[]> = {
  default: [
    { q: 'How soon can a professional arrive?', a: 'Most areas in Patna get same-day slots if you book before 4 PM. Emergency visits may incur a small surcharge.' },
    { q: 'Are prices final?', a: 'Package prices cover standard labour. Extra materials or complex issues are quoted on-site before work begins — you approve first.' },
    { q: 'What if I am not satisfied?', a: 'Contact support within 48 hours. We arrange a free re-visit or refund per our satisfaction guarantee policy.' },
  ],
};

const sampleReviews = [
  { name: 'Amit K.', city: 'Patna', rating: 5, text: 'Technician arrived on time, explained the issue clearly, and cleaned up after work. Highly recommend ServDeal.' },
  { name: 'Sneha M.', city: 'Danapur', rating: 5, text: 'Transparent pricing — no hidden charges. Booking through the app took less than two minutes.' },
  { name: 'Ravi P.', city: 'Gaya', rating: 4, text: 'Good service overall. Would appreciate slightly faster spare part availability for older appliances.' },
];

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const packages = getPackages(service.basePrice);
  const faqs = faqsByCategory[slug] || faqsByCategory.default;
  const related = SERVICES.filter((s) => s.slug !== slug).slice(0, 4);

  return (
    <PublicLayout>
      <section className="bg-brand-navy py-12 text-white lg:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-5">
              <ServiceIcon name={service.icon} className={`${service.color} !h-20 !w-20`} iconClassName="!h-10 !w-10" />
              <div>
                <Badge status="active" className="mb-2 bg-white/20 text-white">
                  Verified Pros
                </Badge>
                <h1 className="text-3xl font-bold md:text-4xl">{service.name}</h1>
                <p className="mt-2 max-w-xl text-white/80">{service.description}</p>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 fill-brand-orange text-brand-orange" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-white/60">(2,400+ bookings)</span>
                </div>
              </div>
            </div>
            <Link href={`/dashboard/book?service=${service.slug}`}>
              <Button size="lg" className="w-full md:w-auto">
                Book Now — from ₹{service.basePrice}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-brand-navy">Choose Your Package</h2>
          <p className="mt-2 text-slate-600">All plans include background-verified professionals and digital invoice.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {packages.map((pkg) => (
              <Card
                key={pkg.name}
                className={`relative p-6 ${pkg.popular ? 'ring-2 ring-brand-orange' : ''}`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-orange px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-brand-navy">{pkg.name}</h3>
                <p className="mt-2 text-3xl font-bold text-brand-orange">₹{pkg.price}</p>
                <ul className="mt-6 space-y-3">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={`/dashboard/book?service=${service.slug}&package=${pkg.name.toLowerCase()}`} className="mt-6 block">
                  <Button variant={pkg.popular ? 'primary' : 'outline'} className="w-full">
                    Select {pkg.name}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-6">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-brand-navy">
            <HelpCircle className="h-7 w-7 text-brand-orange" />
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl bg-white card-shadow">
                <summary className="cursor-pointer list-none p-5 font-semibold text-brand-navy marker:content-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                </summary>
                <p className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-brand-navy">Customer Reviews</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {sampleReviews.map((r) => (
              <Card key={r.name} className="p-6">
                <div className="flex gap-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-brand-orange text-brand-orange" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-600">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-brand-navy">
                  {r.name} · {r.city}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-brand-navy">Related Services</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-2xl border border-slate-100 bg-white p-4 card-shadow hover:border-brand-orange/30"
              >
                <ServiceIcon name={s.icon} className={s.color} />
                <p className="mt-3 font-semibold text-brand-navy">{s.name}</p>
                <p className="text-sm text-brand-orange">From ₹{s.basePrice}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-orange py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-6">
          <h2 className="text-2xl font-bold text-white">Need {service.name} today?</h2>
          <p className="mt-2 text-white/90">Book in under 60 seconds. Pay securely after job completion.</p>
          <Link href={`/dashboard/book?service=${service.slug}`} className="mt-6 inline-block">
            <Button variant="navy" size="lg">
              Book Now
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
