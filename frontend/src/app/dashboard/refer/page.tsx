'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Gift, Copy, Users, Trophy, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

interface ReferralData {
  totalReferrals: number;
  totalRewards: number;
  referredUsers: { name: string; createdAt: string; reward: number }[];
}

export default function ReferPage() {
  const { user } = useAuth();
  const code = user?.referralCode || 'SERVDEAL';
  const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://servdeal.com'}/signup?ref=${code}`;

  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const { data } = await api.get('/referrals/me');
      setData(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader title="Invite & Earn" description="Earn ₹100 for every friend who books a service" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-brand-orange to-orange-600 p-6 text-white text-center">
          <Gift className="mx-auto h-10 w-10" />
          <h2 className="mt-3 text-xl font-bold">Refer & Earn ₹100</h2>
          <p className="mt-1 text-sm text-white/90">Friend gets ₹50 off, you get ₹100</p>
        </Card>
        <Card className="p-6 text-center">
          <Users className="mx-auto h-10 w-10 text-brand-orange" />
          <p className="mt-2 text-2xl font-bold text-brand-navy">{data?.totalReferrals || 0}</p>
          <p className="text-sm text-slate-500">Friends Joined</p>
        </Card>
        <Card className="p-6 text-center">
          <Wallet className="mx-auto h-10 w-10 text-green-500" />
          <p className="mt-2 text-2xl font-bold text-brand-navy">₹{data?.totalRewards || 0}</p>
          <p className="text-sm text-slate-500">Total Earned</p>
        </Card>
      </div>

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
        <h3 className="mb-3 font-bold text-brand-navy flex items-center gap-2"><Trophy className="h-4 w-4" /> Your Referrals</h3>
        {loading ? <p className="text-sm text-slate-500">Loading...</p> : data?.referredUsers?.length === 0 ? (
          <p className="text-sm text-slate-500">No referrals yet. Share your code!</p>
        ) : (
          <div className="space-y-2">
            {data?.referredUsers?.map((u, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium text-brand-navy">{u.name}</p>
                  <p className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-bold text-green-600">+₹{u.reward}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
