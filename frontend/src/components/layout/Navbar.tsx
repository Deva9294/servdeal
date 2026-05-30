'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MapPin, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { BRAND } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about', label: 'About Us' },
  { href: '/become-provider', label: 'Become a Provider' },
  { href: '/worker', label: 'Find Work' },
  { href: '/employer', label: 'Hire Workers' },
  { href: '/contact', label: 'Contact Us' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 lg:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <button className="hidden items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-brand-navy md:flex">
            <MapPin className="h-4 w-4 text-brand-orange" />
            {BRAND.defaultCity}
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        <nav className="hidden items-center gap-4 xl:gap-5 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-[13px] font-medium transition hover:text-brand-orange',
                l.href === '/' ? 'text-brand-orange' : 'text-brand-navy/80'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-2 p-4">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="py-2 font-medium" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <Link href="/login"><Button variant="outline" className="w-full">Login</Button></Link>
              <Link href="/signup"><Button className="w-full">Sign Up</Button></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
