'use client';

import { Shield, Tag, Clock, Headphones, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Shield, title: 'Verified Professionals', color: 'bg-blue-100 text-blue-600' },
  { icon: Tag, title: 'Affordable Pricing', color: 'bg-green-100 text-green-600' },
  { icon: Clock, title: 'On-time Service', color: 'bg-orange-100 text-orange-600' },
  { icon: Headphones, title: 'Customer Support', color: 'bg-cyan-100 text-cyan-600' },
  { icon: Lock, title: 'Safe & Secure', color: 'bg-purple-100 text-purple-600' },
];

export function WhyChoose() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="text-center text-3xl font-bold text-brand-navy">
          Why Choose <span className="text-brand-orange">ServDeal?</span>
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-white p-6 text-center card-shadow"
            >
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-brand-navy">{f.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
