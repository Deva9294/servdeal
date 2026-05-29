'use client';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Gift, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReferPage() {
  const code = 'SDAMAN2026';
  const link = `https://servdeal.com/signup?ref=${code}`;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader title="Invite & Earn" description="Earn ₹100 for every friend who books" />
      <Card className="bg-gradient-to-br from-brand-orange to-orange-600 p-8 text-white text-center">
        <Gift className="mx-auto h-16 w-16" />
        <h2 className="mt-4 text-2xl font-bold">Refer & Earn ₹100</h2>
        <p className="mt-2 text-white/90">Your friend gets ₹50 off. You get ₹100 wallet credit.</p>
      </Card>
      <Card className="p-6 space-y-4">
        <div>
          <p className="text-sm text-slate-500">Your referral code</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-slate-100 px-4 py-3 font-bold text-brand-navy">{code}</code>
            <Button variant="outline" onClick={() => copy(code)}><Copy className="h-4 w-4" /></Button>
          </div>
        </div>
        <div>
          <p className="text-sm text-slate-500">Share link</p>
          <div className="mt-1 flex items-center gap-2">
            <input readOnly value={link} className="flex-1 rounded-lg border px-3 py-2 text-sm" />
            <Button onClick={() => copy(link)}>Copy Link</Button>
          </div>
        </div>
      </Card>
      <Card className="p-5">
        <p className="font-semibold">Total earned: ₹300</p>
        <p className="text-sm text-slate-500">3 successful referrals</p>
      </Card>
    </div>
  );
}
