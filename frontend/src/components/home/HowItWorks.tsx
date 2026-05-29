'use client';

import { motion } from 'framer-motion';
import { MapPin, ClipboardList, UserCheck, ShieldCheck } from 'lucide-react';

const steps = [
  { icon: MapPin, title: 'Choose Location', desc: 'Select your city and area' },
  { icon: ClipboardList, title: 'Select Service', desc: 'Pick from 16+ categories' },
  { icon: UserCheck, title: 'Book Expert', desc: 'Schedule at your convenience' },
  { icon: ShieldCheck, title: 'Get It Done', desc: 'Track & pay securely' },
];

export function HowItWorks() {
  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-navy">
            How It <span className="text-brand-orange">Works</span>
          </h2>
          <p className="mt-2 text-slate-600">Just 4 easy steps to get your work done</p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white card-shadow">
                <step.icon className="h-8 w-8 text-brand-orange" />
              </div>
              <h3 className="mt-4 font-semibold text-brand-navy">{step.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
