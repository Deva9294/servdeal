'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Shield, Star, Users, Wrench, Zap, Droplets, Home, Sparkles, Clock, BadgeCheck, CheckCircle, ArrowRight } from 'lucide-react';
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

const features = [
  { icon: CheckCircle, text: 'Verified Professionals', color: 'text-green-600' },
  { icon: Shield, text: '100% Satisfaction Guarantee', color: 'text-blue-600' },
  { icon: Star, text: '4.8★ Average Rating', color: 'text-amber-600' },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:px-6 lg:py-24 relative">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            <span className="text-sm font-semibold text-orange-700">Now serving 70+ services</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-brand-navy md:text-5xl lg:text-6xl">
            Your Home, Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Responsibility</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-slate-600 leading-relaxed">
            Book trusted professionals for all your home and daily services — fast, easy and reliable. From AC repair to construction, we've got you covered.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
                {feature.text}
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-xl border border-slate-100 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 sm:border-b-0 sm:border-r sm:pr-3 sm:pb-0">
              <MapPin className="h-5 w-5 text-brand-orange" />
              <span className="text-sm font-medium">{BRAND.defaultCity}</span>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search for a service..." className="border-0 pl-10 shadow-none focus:ring-0 bg-slate-50" />
            </div>
            <Link href="/services">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-brand-orange to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg">
                Book Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600">
            <span className="flex items-center gap-2"><Users className="h-5 w-5 text-brand-orange" /> 10,000+ Happy Customers</span>
            <span className="flex items-center gap-2"><Star className="h-5 w-5 text-brand-orange" /> 4.8 Average Rating</span>
            <span className="flex items-center gap-2"><Shield className="h-5 w-5 text-brand-orange" /> 1000+ Verified Professionals</span>
          </div>
        </motion.div>

        {/* Right Side - Enhanced Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden lg:flex justify-center items-center"
        >
          <div className="relative">
            {/* Background gradient circles */}
            <div className="absolute inset-0 -z-10 mx-auto h-96 w-96 rounded-full bg-gradient-to-br from-orange-200/40 via-blue-200/40 to-purple-200/40 blur-3xl" />
            <div className="absolute inset-0 -z-10 mx-auto h-80 w-80 rounded-full bg-gradient-to-br from-brand-orange/20 to-blue-500/20 blur-2xl animate-pulse" />

            {/* Main Hero Image - Professional Service Worker */}
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=700&fit=crop&crop=faces"
                alt="Service Professional"
                className="h-[500px] w-auto rounded-3xl object-cover shadow-2xl border-4 border-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-hero');
                  if (fallback) (fallback as HTMLElement).style.display = 'grid';
                }}
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Fallback floating cards */}
            <div className="fallback-hero hidden grid-cols-2 gap-3 sm:grid-cols-3">
              {serviceCards.map((card) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: card.delay + 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`flex flex-col items-center gap-2 rounded-2xl p-4 ${card.color} bg-white/90 shadow-lg backdrop-blur-sm border border-white/50`}
                >
                  <card.icon className="h-8 w-8" />
                  <span className="text-xs font-semibold">{card.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Floating verified badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -right-6 top-8 z-20 flex items-center gap-2 rounded-full bg-white px-5 py-3 shadow-xl border border-green-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <BadgeCheck className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-brand-navy">Verified Pro</p>
                <p className="text-[10px] text-slate-500">Background checked</p>
              </div>
            </motion.div>

            {/* Floating rating card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="absolute -left-6 bottom-12 z-20 flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-xl border border-amber-100"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <Star className="h-6 w-6 fill-brand-orange text-brand-orange" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-brand-navy">4.8 Rating</p>
                <p className="text-[10px] text-slate-500">10,000+ reviews</p>
              </div>
            </motion.div>

            {/* Floating service count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="absolute -bottom-6 right-8 z-20 rounded-2xl bg-gradient-to-r from-brand-orange to-red-500 px-6 py-4 shadow-xl"
            >
              <p className="text-3xl font-bold text-white">70+</p>
              <p className="text-xs font-medium text-white/90">Services</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
