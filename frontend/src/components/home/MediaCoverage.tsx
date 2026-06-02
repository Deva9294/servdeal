'use client';

import { motion } from 'framer-motion';
import { Newspaper, Radio, Tv, Globe } from 'lucide-react';

const media = [
  { name: 'The Times of India', icon: Newspaper, quote: 'ServDeal is revolutionizing home services in Tier-2 cities.' },
  { name: 'India Today', icon: Tv, quote: 'A startup to watch — bridging the gap between skilled workers and households.' },
  { name: 'YourStory', icon: Globe, quote: 'ServDeal&apos;s verified provider model sets a new standard for trust.' },
  { name: 'NDTV Profit', icon: Radio, quote: 'Growing rapidly with an impressive repeat customer rate of 75%.' },
];

export function MediaCoverage() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">In The News</h2>
          <p className="mt-3 text-lg text-slate-600">Featured by leading publications across India</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {media.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50/50 p-6 transition hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                  <m.icon className="h-5 w-5 text-orange-600" />
                </div>
                <span className="font-semibold text-slate-900">{m.name}</span>
              </div>
              <p className="mt-4 text-sm italic leading-relaxed text-slate-600">&ldquo;{m.quote}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
