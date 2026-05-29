import { MetadataRoute } from 'next';
import { SERVICES } from '@/data/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const staticPages = [
    '', 'about', 'services', 'how-it-works', 'become-provider', 'contact',
    'faqs', 'blog', 'careers', 'terms', 'privacy', 'refund', 'safety', 'help', 'support',
    'login', 'signup',
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${base}/${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...SERVICES.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ];
}
