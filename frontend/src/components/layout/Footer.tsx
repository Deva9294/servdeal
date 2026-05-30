'use client';

import Link from 'next/link';
import { Share2, Camera, MessageCircle, Play } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { BRAND } from '@/lib/constants';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
];

const customerLinks = [
  { href: '/dashboard', label: 'My Bookings' },
  { href: '/dashboard/profile', label: 'My Profile' },
  { href: '/help', label: 'Help & Support' },
  { href: '/faqs', label: 'FAQs' },
];

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <Logo monochrome />
          <p className="mt-4 text-sm text-white/70">
            Book trusted professionals for all your home and daily services — fast, easy and reliable.
          </p>
          <div className="mt-4 flex gap-3">
            {[Share2, Camera, MessageCircle, Play].map((Icon, i) => (
              <a key={i} href="#" className="rounded-lg bg-white/10 p-2 hover:bg-brand-orange">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {quickLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-brand-orange">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">For Customers</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {customerLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-brand-orange">{l.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Subscribe</h4>
          <p className="mt-2 text-sm text-white/70">Get updates and exclusive offers</p>
          <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" className="flex-1 rounded-xl border-0 bg-white/10 px-4 py-2 text-sm placeholder:text-white/50" />
            <Button type="submit" size="sm">Subscribe</Button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-white/60 md:flex-row lg:px-6">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Design &amp; Managed by DevaCore Studio</p>
          <div className="flex gap-6">
            <span>100% Secure Payment</span>
            <span>Verified Professionals</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
      <a
        href={`https://wa.me/${BRAND.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-lg"
      >
        Chat on WhatsApp
      </a>
    </footer>
  );
}
