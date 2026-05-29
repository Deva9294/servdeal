import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { PopularServices } from '@/components/home/PopularServices';
import { HowItWorks } from '@/components/home/HowItWorks';
import { ProviderCTA } from '@/components/home/ProviderCTA';
import { WhyChoose } from '@/components/home/WhyChoose';
import { Testimonials } from '@/components/home/Testimonials';
import { AppDownload } from '@/components/home/AppDownload';
import { BRAND } from '@/lib/constants';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: BRAND.name,
  description: BRAND.tagline,
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  telephone: BRAND.phone,
  areaServed: 'India',
  priceRange: '₹₹',
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
