'use client';

import { ShieldCheck, Award, Star, Users, ThumbsUp, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const partners = [
  { name: 'Verified Professionals', icon: ShieldCheck, count: '5000+' },
  { name: 'Cities Covered', icon: Award, count: '25+' },
  { name: 'Happy Customers', icon: Users, count: '1L+' },
  { name: '5-Star Ratings', icon: Star, count: '50K+' },
  { name: 'Repeat Customers', icon: ThumbsUp, count: '75%' },
  { name: 'Assured Quality', icon: BadgeCheck, count: '100%' },
];

export function TrustedPartners() {
  return (
    <section className="w-full bg-gradient-to-br from-slate-50 to-orange-50/30 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Trusted By Thousands</h2>
          <p className="mt-3 text-lg text-slate-600">India&apos;s most reliable home services platform</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <p.icon className="h-8 w-8 text-orange-500" />
              <span className="mt-2 text-xl font-bold text-slate-900">{p.count}</span>
              <span className="mt-1 text-center text-xs font-medium text-slate-500">{p.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
