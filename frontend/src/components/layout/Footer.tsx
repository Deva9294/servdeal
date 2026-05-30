'use client';

import Link from 'next/link';
import { Share2, Camera, MessageCircle, Play, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { BRAND } from '@/lib/constants';
import { SERVICE_CATEGORIES } from '@/data/services';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'All Services' },
  { href: '/about', label: 'About Us' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

const customerLinks = [
  { href: '/dashboard', label: 'My Bookings' },
  { href: '/dashboard/profile', label: 'My Profile' },
  { href: '/help', label: 'Help & Support' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/privacy', label: 'Privacy Policy' },
];

const topCategories = SERVICE_CATEGORIES.slice(0, 6);

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/10">
                <Logo monochrome className="h-8 w-auto" />
              </div>
              <div>
                <p className="text-lg font-bold">{BRAND.name}</p>
                <p className="text-[10px] tracking-wider text-white/50">{BRAND.tagline}</p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Book trusted professionals for all your home and daily services — fast, easy and reliable. 50+ services across India.
            </p>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-brand-orange" /> {BRAND.phone}</p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-brand-orange" /> {BRAND.email}</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-brand-orange" /> {BRAND.defaultCity}</p>
              <p className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-brand-orange" /> 24/7 Service Available</p>
            </div>
            <div className="mt-4 flex gap-3">
              {[Share2, Camera, MessageCircle, Play].map((Icon, i) => (
                <a key={i} href="#" className="rounded-lg bg-white/10 p-2.5 transition hover:bg-brand-orange">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/90">Quick Links</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {quickLinks.map((l) => (
                <li key={l.href}><Link href={l.href} className="transition hover:text-brand-orange">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* For Customers */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/90">For Customers</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {customerLinks.map((l) => (
                <li key={l.href}><Link href={l.href} className="transition hover:text-brand-orange">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Top Categories */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/90">Top Categories</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {topCategories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/services?category=${c.slug}`} className="transition hover:text-brand-orange">{c.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white/90">Newsletter</h4>
            <p className="mt-4 text-sm text-white/70">Get updates and exclusive offers</p>
            <form className="mt-4 space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" className="w-full rounded-xl border-0 bg-white/10 px-4 py-2.5 text-sm placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-brand-orange" />
              <Button type="submit" size="sm" className="w-full">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-white/50 md:flex-row lg:px-6">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p className="font-medium">Design &amp; Managed by DevaCore Studio</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-400" />100% Secure Payment</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-400" />Verified Professionals</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-400" />24/7 Support</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${BRAND.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-600"
      >
        Chat on WhatsApp
      </a>
    </footer>
  );
}
