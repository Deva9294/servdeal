'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const stories = [
  {
    name: 'Rahul Sharma',
    role: 'Homeowner, Patna',
    text: 'ServDeal saved my day when my AC broke down in the middle of summer. The technician arrived within 30 minutes and fixed it professionally. Highly recommended!',
    rating: 5,
    service: 'AC Repair',
  },
  {
    name: 'Priya Patel',
    role: 'Working Professional, Sehore',
    text: 'I use ServDeal for all my home cleaning needs. The providers are punctual, polite, and always do a thorough job. The wallet cashback is a great bonus!',
    rating: 5,
    service: 'Home Cleaning',
  },
  {
    name: 'Amit Kumar',
    role: 'Business Owner, Rehti',
    text: 'As a small business owner, I needed a reliable electrician for my shop renovation. ServDeal matched me with a verified professional who completed the work flawlessly.',
    rating: 5,
    service: 'Electrical Work',
  },
];

export function CustomerSuccessStories() {
  return (
    <section className="w-full bg-gradient-to-br from-slate-50 to-orange-50/30 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Customer Success Stories</h2>
          <p className="mt-3 text-lg text-slate-600">Real experiences from real customers</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {stories.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-orange-100" />
              <div className="flex gap-1">
                {Array.from({ length: s.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{s.text}</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.role}</p>
                </div>
              </div>
              <span className="mt-4 inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                {s.service}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
