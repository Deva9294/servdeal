'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QrCode, Award, Star, Briefcase, Shield, Download } from 'lucide-react';

interface WorkerCardData {
  cardId: string;
  name: string;
  photo: string;
  skills: string[];
  rating: number;
  totalJobs: number;
  trustScore: number;
  verified: boolean;
  issueDate: string;
  expiryDate: string;
}

export default function WorkerCardPage() {
  const { isLoggedIn } = useAuth();
  const [card, setCard] = useState<WorkerCardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) fetchCard();
    else setLoading(false);
  }, [isLoggedIn]);

  const fetchCard = async () => {
    try {
      const { data } = await api.get('/worker-cards/me');
      setCard(data.card);
    } catch {
      // No card yet
    } finally {
      setLoading(false);
    }
  };

  const createCard = async () => {
    try {
      const { data } = await api.post('/worker-cards');
      toast.success('Digital worker card created!');
      setCard(data.card);
    } catch {
      toast.error('Failed to create card');
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-500">Loading...</div>;

  if (!card) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <Card className="max-w-md p-8 text-center">
          <Shield className="mx-auto h-12 w-12 text-brand-orange" />
          <h2 className="mt-4 text-xl font-bold text-brand-navy">Digital Worker Card</h2>
          <p className="mt-2 text-slate-500">Create your official ServDeal worker ID card with QR code verification.</p>
          <Button className="mt-6" onClick={createCard}>Generate My Card</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Digital Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-navy to-blue-900 p-6 text-white shadow-2xl">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/70">ServDeal Worker ID</p>
                <p className="text-lg font-bold">{card.cardId}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
                {card.name?.charAt(0)}
              </div>
              <div>
                <p className="text-xl font-bold">{card.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  {card.verified && <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium">Verified</span>}
                  <span className="flex items-center gap-1 text-sm"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {card.rating}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white/10 p-2">
                <p className="text-lg font-bold">{card.totalJobs}</p>
                <p className="text-[10px] text-white/70">Jobs</p>
              </div>
              <div className="rounded-lg bg-white/10 p-2">
                <p className="text-lg font-bold">{card.trustScore}</p>
                <p className="text-[10px] text-white/70">Trust</p>
              </div>
              <div className="rounded-lg bg-white/10 p-2">
                <p className="text-lg font-bold">{card.skills?.length || 0}</p>
                <p className="text-[10px] text-white/70">Skills</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-xs text-white/60">
                <p>Issued: {new Date(card.issueDate).toLocaleDateString()}</p>
                <p>Expires: {card.expiryDate ? new Date(card.expiryDate).toLocaleDateString() : 'Never'}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-white p-1">
                <QrCode className="h-full w-full text-brand-navy" />
              </div>
            </div>
          </div>
        </div>

        <Card className="mt-4 p-4">
          <h3 className="font-bold text-brand-navy">Skills</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {card.skills?.map((skill, i) => (
              <span key={i} className="rounded-full bg-brand-navy/5 px-3 py-1 text-xs text-brand-navy">{skill}</span>
            ))}
          </div>
        </Card>

        <div className="mt-4 flex gap-3">
          <Button variant="secondary" className="flex-1"><Download className="h-4 w-4 mr-1" /> Save Card</Button>
        </div>
      </div>
    </div>
  );
}
