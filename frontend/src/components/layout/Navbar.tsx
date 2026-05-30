'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
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
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const moreLinks = [
  { href: '/become-provider', label: 'Become a Provider' },
  { href: '/worker', label: 'Find Work' },
  { href: '/employer', label: 'Hire Workers' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 lg:px-6">
        {/* Logo + City */}
        <div className="flex items-center gap-2 shrink-0">
          <Logo />
          <button className="hidden items-center gap-1 rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-brand-navy md:flex">
            <MapPin className="h-3 w-3 text-brand-orange" />
            {BRAND.defaultCity}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-3 xl:gap-4 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-xs font-medium whitespace-nowrap transition hover:text-brand-orange',
                l.href === '/' ? 'text-brand-orange' : 'text-brand-navy/80'
              )}
            >
              {l.label}
            </Link>
          ))}
          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-0.5 text-xs font-medium text-brand-navy/80 hover:text-brand-orange whitespace-nowrap"
            >
              More
              {moreOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-100 bg-white py-2 shadow-lg"
                >
                  {moreLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block px-4 py-2 text-xs font-medium text-brand-navy/80 hover:bg-slate-50 hover:text-brand-orange"
                      onClick={() => setMoreOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right: Login/Signup */}
        <div className="hidden items-center gap-2 lg:flex shrink-0">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs h-8">Login</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="text-xs h-8">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-white lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {[...links, ...moreLinks].map((l) => (
                <Link key={l.href} href={l.href} className="py-2 text-sm font-medium" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                <Link href="/login" className="flex-1"><Button variant="outline" className="w-full text-xs">Login</Button></Link>
                <Link href="/signup" className="flex-1"><Button className="w-full text-xs">Sign Up</Button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
