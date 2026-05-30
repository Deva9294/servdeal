'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Shield, Star, Users, Wrench, Zap, Droplets, Home, Sparkles, Clock, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BRAND } from '@/lib/constants';

const serviceCards = [
  { icon: Zap, label: 'Electrician', color: 'bg-amber-50 text-amber-600', delay: 0 },
  { icon: Wrench, label: 'AC Repair', color: 'bg-blue-50 text-blue-600', delay: 0.1 },
  { icon: Droplets, label: 'Plumbing', color: 'bg-cyan-50 text-cyan-600', delay: 0.2 },
  { icon: Home, label: 'Cleaning', color: 'bg-green-50 text-green-600', delay: 0.3 },
  { icon: Sparkles, label: 'Painting', color: 'bg-purple-50 text-purple-600', delay: 0.4 },
  { icon: Clock, label: 'On Time', color: 'bg-rose-50 text-rose-600', delay: 0.5 },
];

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

        {/* Right Side - Floating Service Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="relative">
            {/* Background circle */}
            <div className="absolute inset-0 -z-10 mx-auto h-80 w-80 rounded-full bg-gradient-to-br from-orange-100/60 to-blue-100/60 blur-2xl lg:h-96 lg:w-96" />

            {/* Floating cards grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {serviceCards.map((card) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: card.delay + 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`flex flex-col items-center gap-2 rounded-2xl p-4 ${card.color} bg-white/80 shadow-lg backdrop-blur-sm`}
                >
                  <card.icon className="h-8 w-8" />
                  <span className="text-xs font-semibold">{card.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Floating verified badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 -top-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg"
            >
              <BadgeCheck className="h-5 w-5 text-green-500" />
              <span className="text-xs font-semibold text-brand-navy">Verified Pro</span>
            </motion.div>

            {/* Floating rating */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg"
            >
              <Star className="h-5 w-5 fill-brand-orange text-brand-orange" />
              <span className="text-xs font-semibold text-brand-navy">4.8 Rating</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
