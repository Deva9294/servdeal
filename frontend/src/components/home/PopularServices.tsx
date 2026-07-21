'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SERVICES } from '@/data/services';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import { Button } from '@/components/ui/Button';

export function PopularServices() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 mb-4">
              <Sparkles className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-700">Most Booked</span>
            </div>
            <h2 className="text-3xl font-bold text-brand-navy md:text-4xl">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Popular Services</span>
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">Quality service for every need, delivered by verified professionals</p>
          </motion.div>
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
                className="group flex flex-col items-start gap-4 rounded-2xl bg-white p-6 shadow-lg border border-slate-100 transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-brand-orange/30"
              >
                <div className={`rounded-2xl p-3 ${service.color}`}>
                  <ServiceIcon name={service.icon} className="h-6 w-6" />
                </div>
                <div className="flex w-full items-center justify-between">
                  <div>
                    <span className="font-semibold text-brand-navy block">{service.name}</span>
                    <span className="text-xs text-slate-500">Starting ₹{service.basePrice}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-brand-orange opacity-0 transition group-hover:opacity-100 group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/services">
            <Button className="bg-gradient-to-r from-brand-orange to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg">
              View All 70+ Services <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
