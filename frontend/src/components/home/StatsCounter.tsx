'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { label: 'Services Delivered', value: 500000, suffix: '+' },
  { label: 'Verified Providers', value: 5000, suffix: '+' },
  { label: 'Cities Covered', value: 25, suffix: '+' },
  { label: 'Customer Satisfaction', value: 98, suffix: '%' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

export function StatsCounter() {
  return (
    <section className="w-full bg-[#0b1f4d] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-extrabold text-white md:text-4xl">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-sm font-medium text-slate-300">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
