import type { Metadata } from 'next';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { PopularServices } from '@/components/home/PopularServices';
import { HowItWorks } from '@/components/home/HowItWorks';
import { ProviderCTA } from '@/components/home/ProviderCTA';
import { WhyChoose } from '@/components/home/WhyChoose';
import { Testimonials } from '@/components/home/Testimonials';
import { AppDownload } from '@/components/home/AppDownload';
import { BRAND } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${BRAND.name} | ${BRAND.tagline}`,
  description: `Book 50+ verified home services — AC repair, electrician, plumber, cleaning, construction, digital services and more in ${BRAND.defaultCity}. Same-day booking, upfront pricing.`,
  keywords: ['home services', 'AC repair', 'electrician', 'plumber', 'cleaning', 'construction', 'ServDeal', 'Rehti', 'Sehore', 'Madhya Pradesh'],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BRAND.name,
  description: `Book trusted professionals for all your home and daily services in ${BRAND.defaultCity} — fast, easy and reliable.`,
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  telephone: BRAND.phone,
  email: BRAND.email,
  areaServed: {
    '@type': 'City',
    name: BRAND.defaultCity,
    addressCountry: 'IN',
  },
  priceRange: '₹₹',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '10000',
  },
};

export default function HomePage() {
  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection />
      <PopularServices />
      <HowItWorks />
      <ProviderCTA />
      <WhyChoose />
      <Testimonials />
      <AppDownload />
    </PublicLayout>
  );
}
