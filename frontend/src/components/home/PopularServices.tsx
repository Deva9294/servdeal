'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import { Button } from '@/components/ui/Button';

export function PopularServices() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-navy md:text-4xl">
            Our <span className="text-brand-orange">Popular Services</span>
          </h2>
          <p className="mt-2 text-slate-600">Quality service for every need</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SERVICES.slice(0, 8).map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group flex flex-col items-start gap-4 rounded-2xl bg-white p-5 card-shadow transition hover:-translate-y-1 hover:shadow-xl"
              >
                <ServiceIcon name={service.icon} className={service.color} />
                <div className="flex w-full items-center justify-between">
                  <span className="font-semibold text-brand-navy">{service.name}</span>
                  <ArrowRight className="h-4 w-4 text-brand-orange opacity-0 transition group-hover:opacity-100" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/services">
            <Button variant="secondary">View All Services</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
