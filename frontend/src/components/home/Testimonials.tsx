'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  { name: 'Priya Sharma', city: 'Patna', text: 'Excellent AC service! The technician was professional and fixed everything quickly.', rating: 5 },
  { name: 'Rahul Verma', city: 'Delhi', text: 'Best electrician service I have used. Transparent pricing and on-time arrival.', rating: 5 },
  { name: 'Anita Singh', city: 'Mumbai', text: 'ServDeal made home cleaning so easy. Will definitely book again!', rating: 5 },
];

export function Testimonials() {
  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="text-center text-3xl font-bold text-brand-navy">
          What Our <span className="text-brand-orange">Customers</span> Say
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white p-6 card-shadow"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-brand-orange text-brand-orange" />
                ))}
              </div>
              <p className="mt-4 text-slate-600">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-brand-navy">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
