'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ProviderCTA() {
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-6 lg:p-8"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-brand-orange p-3">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-navy">Become a Top Rated Provider</h2>
              <p className="text-sm text-slate-600">Complete more bookings and get 5 star reviews to unlock more benefits.</p>
            </div>
          </div>
          <Link href="/become-provider">
            <Button className="bg-brand-orange hover:bg-brand-orange/90 whitespace-nowrap">Know More</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
