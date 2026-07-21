'use client';

import { Shield, Tag, Clock, Headphones, Lock, Award, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { 
    icon: Shield, 
    title: 'Verified Professionals', 
    description: 'Background checked experts',
    color: 'bg-blue-100 text-blue-600',
    stat: '1000+'
  },
  { 
    icon: Tag, 
    title: 'Affordable Pricing', 
    description: 'Transparent rates',
    color: 'bg-green-100 text-green-600',
    stat: 'Best Price'
  },
  { 
    icon: Clock, 
    title: 'On-time Service', 
    description: 'Punctual & reliable',
    color: 'bg-orange-100 text-orange-600',
    stat: '98%'
  },
  { 
    icon: Headphones, 
    title: '24/7 Support', 
    description: 'Always here to help',
    color: 'bg-cyan-100 text-cyan-600',
    stat: '24/7'
  },
  { 
    icon: Lock, 
    title: 'Safe & Secure', 
    description: 'Your safety first',
    color: 'bg-purple-100 text-purple-600',
    stat: '100%'
  },
];

export function WhyChoose() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-brand-navy md:text-4xl">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">ServDeal?</span>
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">We deliver quality service with trust, reliability, and customer satisfaction at the core</p>
        </motion.div>
        
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="group rounded-2xl bg-gradient-to-br from-white to-slate-50 p-6 text-center shadow-lg border border-slate-100 hover:shadow-xl hover:border-brand-orange/30 transition-all"
            >
              <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${f.color} group-hover:scale-110 transition-transform`}>
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-brand-navy">{f.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{f.description}</p>
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                <span className="text-xs font-bold text-brand-navy">{f.stat}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-center"
        >
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-orange" />
            <span className="text-sm font-medium text-slate-700">10,000+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-brand-orange" />
            <span className="text-sm font-medium text-slate-700">4.8★ Average Rating</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
