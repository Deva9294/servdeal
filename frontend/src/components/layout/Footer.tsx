'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
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
              {/* Facebook */}
              <a href="https://facebook.com/servdeal" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="rounded-lg bg-[#1877F2]/20 p-2.5 transition hover:bg-[#1877F2]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/servdeal" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-lg bg-[#E4405F]/20 p-2.5 transition hover:bg-[#E4405F]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/@servdeal" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="rounded-lg bg-[#FF0000]/20 p-2.5 transition hover:bg-[#FF0000]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              {/* WhatsApp */}
              <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-lg bg-[#25D366]/20 p-2.5 transition hover:bg-[#25D366]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.3A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.13 1.58 5.929L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              {/* Twitter/X */}
              <a href="https://x.com/servdeal" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="rounded-lg bg-[#000000]/20 p-2.5 transition hover:bg-[#000000]">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
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
