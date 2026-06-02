'use client';

import { motion } from 'framer-motion';
import { Shield, RotateCcw, HeadphonesIcon, Clock, Wallet, ThumbsUp } from 'lucide-react';

const guarantees = [
  {
    icon: Shield,
    title: 'Verified Professionals',
    desc: 'Every provider undergoes background checks, skill verification, and document validation.',
  },
  {
    icon: Clock,
    title: 'On-Time Service',
    desc: 'We guarantee timely arrival. Track your provider in real-time and get live ETA updates.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Service Warranty',
    desc: 'All services come with a 30-day warranty. If anything goes wrong, we fix it free.',
  },
  {
    icon: Wallet,
    title: 'Transparent Pricing',
    desc: 'No hidden charges. Get upfront quotes before booking. Pay only for what you approve.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    desc: 'Our support team is available round the clock to assist with any issues.',
  },
  {
    icon: ThumbsUp,
    title: 'Satisfaction Guaranteed',
    desc: 'Not happy with the service? We will redo it or refund your money. No questions asked.',
  },
];

export function ServiceGuarantee() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Our Service Guarantee</h2>
          <p className="mt-3 text-lg text-slate-600">Your trust is our top priority. Here is what we promise:</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guarantees.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition hover:border-orange-200 hover:bg-orange-50/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                <g.icon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{g.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{g.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
