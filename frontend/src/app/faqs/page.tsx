'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PageHero } from '@/components/content/PageHero';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQ_ITEMS = [
  {
    q: 'What cities does ServDeal operate in?',
    a: 'We are live in Patna, Danapur, and nearby areas in Bihar, with expansion to more tier-2 cities underway. Enter your pincode during booking to confirm availability.',
  },
  {
    q: 'How are service professionals verified?',
    a: 'Every partner completes government ID verification, reference checks, and category-specific skill assessment before receiving bookings on the platform.',
  },
  {
    q: 'Can I pay after the job is done?',
    a: 'Yes. You can pay via UPI, card, or ServDeal wallet after approving completed work. Cash is discouraged for safety and warranty tracking.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'Cancel free up to 2 hours before the scheduled slot. Late cancellations may incur a nominal fee to compensate the professional\'s travel time.',
  },
  {
    q: 'Do you provide a warranty on repairs?',
    a: 'Most packages include 30–90 day service warranty depending on the plan. Spare parts carry manufacturer warranty where applicable.',
  },
  {
    q: 'How do I become a service partner?',
    a: 'Visit Become a Provider, complete registration, and upload documents. Onboarding typically takes 2–3 business days after verification.',
  },
  {
    q: 'Is ServDeal available on mobile?',
    a: 'Yes — book via our website or download the Android app (iOS coming soon). OTP login makes repeat booking faster.',
  },
  {
    q: 'Who do I contact for payment disputes?',
    a: 'Email support@servdeal.com or use Help & Support in your dashboard. We investigate within 48 hours and resolve per our refund policy.',
  },
];

export default function FaqsPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PublicLayout>
      <PageHero title="Frequently Asked" highlight="Questions" description="Quick answers about booking, payments, safety, and partner programs." />

      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-6">
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={item.q} className="overflow-hidden rounded-xl bg-white card-shadow border border-slate-100">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-brand-navy"
                >
                  {item.q}
                  <ChevronDown className={cn('h-5 w-5 shrink-0 text-brand-orange transition', open === i && 'rotate-180')} />
                </button>
                {open === i && <p className="border-t border-slate-100 px-5 pb-5 pt-2 text-sm text-slate-600">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
