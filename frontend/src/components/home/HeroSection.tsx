'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Shield, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BRAND } from '@/lib/constants';

export function HeroSection() {
  return (
    <section className="gradient-hero overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:px-6 lg:py-24">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-extrabold leading-tight text-brand-navy md:text-5xl lg:text-6xl">
            Fixing Problems, Delivering{' '}
            <span className="text-brand-orange">Trust</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-slate-600">
            Book trusted professionals for all your home and daily services — fast, easy and reliable.
          </p>

          <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-3 card-shadow sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 sm:border-b-0 sm:border-r sm:pr-3 sm:pb-0">
              <MapPin className="h-5 w-5 text-brand-orange" />
              <span className="text-sm font-medium">{BRAND.defaultCity}</span>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search for a service..." className="border-0 pl-10 shadow-none focus:ring-0" />
            </div>
            <Link href="/services">
              <Button className="w-full sm:w-auto">Book Now</Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-2"><Users className="h-5 w-5 text-brand-orange" /> 10,000+ Happy Customers</span>
            <span className="flex items-center gap-2"><Star className="h-5 w-5 text-brand-orange" /> 4.8 Average Rating</span>
            <span className="flex items-center gap-2"><Shield className="h-5 w-5 text-brand-orange" /> 100% Verified Professionals</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="relative h-80 w-80 rounded-full bg-gradient-to-br from-orange-100 to-blue-100 lg:h-96 lg:w-96">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-brand-navy text-6xl">👨‍🔧</div>
                <p className="mt-4 font-semibold text-brand-navy">Verified Pro at your door</p>
              </div>
            </div>
            <div className="absolute -right-4 top-8 rounded-2xl bg-white p-3 card-shadow">
              <p className="text-xs text-slate-500">ServDeal App</p>
              <div className="mt-1 h-24 w-16 rounded-lg bg-brand-navy/10" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
