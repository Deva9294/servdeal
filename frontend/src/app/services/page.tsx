import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { SERVICES } from '@/data/services';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'All Services',
  description: 'Browse 16+ home and local services — AC repair, electrician, plumbing, cleaning, and more on ServDeal.',
};

export default function ServicesPage() {
  return (
    <PublicLayout>
      <PageHero
        title="All"
        highlight="Services"
        description="Upfront pricing, verified professionals, and same-day availability across Patna and expanding cities."
      />

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
