'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ProviderProfile {
  overallStatus: string;
  rejectionReason?: string;
  isAvailable: boolean;
  totalJobs: number;
  rating: number;
  completedJobs: number;
  earnings: number;
  skills: Array<{ name: string; experienceYears: number }>;
  kycStatus: string;
  bankStatus: string;
  bio?: string;
}

export default function ProviderDashboardPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login?role=provider');
      return;
    }
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/providers/profile/me');
      setProfile(data.profile);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    if (!profile) return;
    setToggleLoading(true);
    try {
      const newState = !profile.isAvailable;
      await api.patch('/providers/availability', { isAvailable: newState });
      setProfile({ ...profile, isAvailable: newState });
      toast.success(newState ? 'You are now available!' : 'You are now offline');
    } catch {
      toast.error('Failed to update availability');
    } finally {
      setToggleLoading(false);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-600">Loading...</div>;

  const statusColors: Record<string, string> = {
    approved: 'bg-green-100 text-green-700',
    pending_approval: 'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
    incomplete: 'bg-slate-100 text-slate-700',
    suspended: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    approved: 'Approved',
    pending_approval: 'Pending Approval',
    rejected: 'Rejected',
    incomplete: 'Incomplete',
    suspended: 'Suspended',
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Provider Dashboard</h1>
          <p className="text-sm text-slate-500">Manage your profile and availability</p>
        </div>
        <Link href="/" className="text-brand-orange hover:underline text-sm">
          Back to Home
        </Link>
      </div>

      {!profile ? (
        <Card className="p-8 text-center">
          <p className="mb-4 text-slate-600">Complete your provider profile to start accepting bookings.</p>
          <Button onClick={() => router.push('/provider/register')}>
            Complete Profile
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Status Card */}
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Status</h2>
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusColors[profile.overallStatus] || 'bg-slate-100'}`}>
              {statusLabels[profile.overallStatus] || profile.overallStatus}
            </span>
            {profile.rejectionReason && (
              <p className="mt-2 text-xs text-red-600">{profile.rejectionReason}</p>
            )}
          </Card>

          {/* Availability Toggle */}
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Availability</h2>
            <div className="flex items-center gap-3">
              <div className={`relative inline-flex h-7 w-12 cursor-pointer rounded-full transition-colors ${profile.isAvailable ? 'bg-brand-orange' : 'bg-slate-300'}`} onClick={toggleAvailability}>
                <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${profile.isAvailable ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm font-medium">
                {profile.isAvailable ? 'Available' : 'Offline'}
              </span>
              {toggleLoading && <span className="text-xs text-slate-400">Updating...</span>}
            </div>
            <p className="mt-2 text-xs text-slate-500">Toggle to go online/offline for bookings</p>
          </Card>

          {/* Stats */}
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-bold text-brand-navy">{profile.totalJobs || 0}</p>
                <p className="text-xs text-slate-500">Total Jobs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{profile.rating?.toFixed(1) || '0.0'}</p>
                <p className="text-xs text-slate-500">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">{profile.completedJobs || 0}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-navy">₹{profile.earnings || 0}</p>
                <p className="text-xs text-slate-500">Earnings</p>
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-5 md:col-span-2">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Skills & Services</h2>
            {profile.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: { name: string; experienceYears: number }, i: number) => (
                  <span key={i} className="rounded-full bg-brand-navy/5 px-3 py-1 text-sm text-brand-navy">
                    {skill.name} ({skill.experienceYears} yrs)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No skills added yet.</p>
            )}
          </Card>

          {/* KYC */}
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">KYC Status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Identity</span>
                <span className={profile.kycStatus === 'verified' ? 'text-green-600' : 'text-amber-600'}>
                  {profile.kycStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Bank</span>
                <span className={profile.bankStatus === 'verified' ? 'text-green-600' : 'text-amber-600'}>
                  {profile.bankStatus}
                </span>
              </div>
            </div>
          </Card>

          {/* Bio */}
          {profile.bio && (
            <Card className="p-5 md:col-span-3">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">Bio</h2>
              <p className="text-sm text-slate-700">{profile.bio}</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
