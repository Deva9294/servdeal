import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/providers/AppProviders';
import { BRAND } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: `${BRAND.name} | ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    'Book trusted home service professionals — AC repair, electrician, plumbing, cleaning and more. Fixing Problems, Delivering Trust.',
  keywords: ['home services', 'AC repair', 'electrician', 'plumber', 'ServDeal', 'Patna'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: BRAND.name,
    title: BRAND.name,
    description: BRAND.tagline,
  },
  twitter: { card: 'summary_large_image', title: BRAND.name, description: BRAND.tagline },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff7a00" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
