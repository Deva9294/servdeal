'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ProviderCTA() {
  return (
    <section className="bg-brand-navy py-16 text-white lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-3 lg:px-6">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold">Become a Top Rated Provider</h2>
          <p className="mt-3 text-white/70">Join thousands of professionals earning with ServDeal</p>
          <Link href="/become-provider" className="mt-6 inline-block">
            <Button>Join as Provider</Button>
          </Link>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-3 lg:col-span-1">
          {[
            { icon: TrendingUp, label: 'More Bookings' },
            { icon: Wallet, label: 'More Earnings' },
            { icon: BarChart3, label: 'Grow Your Business' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <item.icon className="mx-auto h-8 w-8 text-brand-orange" />
              <p className="mt-2 text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="hidden justify-center lg:flex">
          <div className="flex h-48 w-48 items-center justify-center rounded-full bg-white/10 text-8xl">👍</div>
        </div>
      </div>
    </section>
  );
}
