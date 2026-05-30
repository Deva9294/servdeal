import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { SERVICES, SERVICE_CATEGORIES } from '@/data/services';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import { Badge } from '@/components/ui/Badge';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: `All Services | ${BRAND.name}`,
  description: `Browse 50+ verified home services — AC repair, electrician, plumbing, cleaning, construction, digital services and more in ${BRAND.defaultCity}. Book trusted professionals online.`,
  keywords: ['home services', 'AC repair', 'electrician', 'plumber', 'cleaning', 'construction', 'digital services', 'ServDeal', 'Rehti', 'Sehore'],
  openGraph: {
    title: `All Services | ${BRAND.name}`,
    description: `Book 50+ verified services in ${BRAND.defaultCity}. Instant booking, upfront pricing.`,
    url: '/services',
  },
};

export default function ServicesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ServDeal Services',
    itemListElement: SERVICES.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.name,
      url: `https://servdeal-frontend.onrender.com/services/${service.slug}`,
    })),
  };

  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        title="All"
        highlight="Services"
        description={`${SERVICES.length}+ verified services with upfront pricing and same-day availability across ${BRAND.defaultCity} and expanding cities.`}
      />

      {/* Category Browse */}
      <section className="pb-8 pt-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-brand-navy">Browse by Category</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {SERVICE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/services?category=${cat.slug}`}
                className="flex items-center gap-3 rounded-xl bg-white p-3 border border-slate-100 card-shadow transition hover:-translate-y-0.5 hover:border-brand-orange/30"
              >
                <ServiceIcon name={cat.icon} className="bg-brand-orange/10 text-brand-orange shrink-0" iconClassName="h-5 w-5" />
                <span className="text-sm font-semibold text-brand-navy">{cat.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Services */}
      <section className="pb-20 pt-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-brand-navy">All Services</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group rounded-2xl bg-white p-5 card-shadow border border-slate-100 transition hover:-translate-y-1 hover:border-brand-orange/30"
              >
                <ServiceIcon name={service.icon} className={service.color} />
                <h2 className="mt-4 font-semibold text-brand-navy group-hover:text-brand-orange">
                  {service.name}
                </h2>
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{service.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand-orange">
                    From ₹{service.basePrice}
                  </span>
                  <Badge status="active" className="text-[10px]">
                    Popular
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
