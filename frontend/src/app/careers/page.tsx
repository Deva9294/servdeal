import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BRAND } from '@/lib/constants';
import { MapPin, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the ServDeal team — build technology that empowers home service professionals across India.',
};

const openings = [
  {
    title: 'Operations Manager — Patna',
    type: 'Full-time',
    location: 'Patna, Bihar',
    desc: 'Lead provider onboarding, quality audits, and city-level growth. 3+ years in ops or field management.',
  },
  {
    title: 'Customer Support Executive',
    type: 'Full-time',
    location: 'Patna / Remote hybrid',
    desc: 'Handle booking queries in Hindi & English via phone and chat. Evening shifts with rotation off.',
  },
  {
    title: 'Full Stack Developer',
    type: 'Full-time',
    location: 'Remote (India)',
    desc: 'Next.js, Node.js, MongoDB. Build booking flows, payments, and partner dashboards.',
  },
  {
    title: 'Field Marketing Associate',
    type: 'Contract',
    location: 'Bihar districts',
    desc: 'On-ground partner recruitment and local campaigns. Two-wheeler required.',
  },
];

export default function CareersPage() {
  return (
    <PublicLayout>
      <PageHero
        title="Build the Future of"
        highlight="Home Services"
        description={`Join ${BRAND.name} and help millions of Indian families access trustworthy professionals — while creating meaningful jobs in your community.`}
      />

      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-brand-navy">Open Positions</h2>
          <div className="mt-8 space-y-4">
            {openings.map((job) => (
              <Card key={job.title} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-brand-navy">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4 text-brand-orange" />
                        {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-brand-orange" />
                        {job.location}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{job.desc}</p>
                  </div>
                  <Badge status="active">{job.type}</Badge>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-12 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">
              Don&apos;t see your role? Send your resume to{' '}
              <a href={`mailto:careers@servdeal.com`} className="font-semibold text-brand-orange hover:underline">
                careers@servdeal.com
              </a>
            </p>
            <Link href="/contact" className="mt-4 inline-block">
              <Button variant="secondary">Contact HR</Button>
            </Link>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
