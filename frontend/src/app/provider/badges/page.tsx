'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Award, Shield, CheckCircle } from 'lucide-react';
import { SkeletonPulse } from '@/components/ui/SkeletonCard';

interface Badge {
  _id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  description: string;
}

interface MyBadge {
  badge: Badge;
  awardedAt: string;
  verifiedBy?: { name: string };
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [myBadges, setMyBadges] = useState<MyBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        api.get('/badges'),
        api.get('/badges/me'),
      ]);
      setBadges(allRes.data.badges || []);
      setMyBadges(myRes.data.badges || []);
    } catch {
      toast.error('Failed to load badges');
    } finally {
      setLoading(false);
    }
  };

  const hasBadge = (id: string) => myBadges.some((b) => b.badge._id === id);

  if (loading) return <SkeletonPulse />;

  const categories = ['skill', 'safety', 'quality', 'experience', 'trust', 'special'];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Skill Verification Badges" description="Earn badges to build trust with customers" />

      {/* My Badges */}
      {myBadges.length > 0 && (
        <Card className="mb-6 p-6">
          <h2 className="mb-4 text-lg font-bold text-brand-navy flex items-center gap-2">
            <Award className="h-5 w-5 text-brand-orange" /> My Earned Badges
          </h2>
          <div className="flex flex-wrap gap-3">
            {myBadges.map((b) => (
              <div key={b.badge._id} className="flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-2 border border-orange-100">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: b.badge.color }}>
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{b.badge.name}</p>
                  <p className="text-xs text-slate-500">{new Date(b.awardedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Available Badges by Category */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const catBadges = badges.filter((b) => b.category === cat);
          if (catBadges.length === 0) return null;
          return (
            <Card key={cat} className="p-6">
              <h2 className="mb-4 text-lg font-bold text-brand-navy capitalize">{cat.replace('_', ' ')} Badges</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catBadges.map((badge) => {
                  const earned = hasBadge(badge._id);
                  return (
                    <div key={badge._id} className={`rounded-xl border p-4 ${earned ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-white'}`}>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: badge.color }}>
                          <Shield className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-brand-navy">{badge.name}</p>
                          <p className="text-xs text-slate-500">{badge.description}</p>
                        </div>
                        {earned && <CheckCircle className="h-5 w-5 text-green-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
