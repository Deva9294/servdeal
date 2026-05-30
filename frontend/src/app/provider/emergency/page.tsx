'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Zap, Shield, Phone, MapPin } from 'lucide-react';
import { SkeletonPulse } from '@/components/ui/SkeletonCard';

export default function EmergencyModePage() {
  const [profile, setProfile] = useState<any>(null);
  const [emergencyOn, setEmergencyOn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/providers/profile/me');
      setProfile(data.profile);
      setEmergencyOn(data.profile?.emergencyAvailable || false);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleEmergency = async () => {
    try {
      const newState = !emergencyOn;
      await api.patch('/providers/availability', { emergencyAvailable: newState });
      setEmergencyOn(newState);
      toast.success(newState ? 'Emergency mode ON - You will receive urgent jobs' : 'Emergency mode OFF');
    } catch {
      toast.error('Failed to update');
    }
  };

  if (loading) return <SkeletonPulse />;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Emergency Work Mode" description="Be available for urgent jobs with premium pricing" />

      <Card className={`p-8 text-center ${emergencyOn ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${emergencyOn ? 'bg-red-500 animate-pulse' : 'bg-slate-200'}`}>
          <Zap className={`h-10 w-10 ${emergencyOn ? 'text-white' : 'text-slate-500'}`} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-brand-navy">
          {emergencyOn ? 'You are in Emergency Mode' : 'Emergency Mode is OFF'}
        </h2>
        <p className="mt-2 text-slate-500">
          {emergencyOn
            ? 'Customers can book you for urgent jobs. You earn 1.5x standard rates.'
            : 'Turn on to receive urgent job requests with premium pay.'}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Button variant={emergencyOn ? 'outline' : 'primary'} onClick={toggleEmergency}>
            {emergencyOn ? 'Turn Off Emergency Mode' : 'Activate Emergency Mode'}
          </Button>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="p-5 text-center">
          <Shield className="mx-auto h-8 w-8 text-brand-orange" />
          <p className="mt-2 font-bold text-brand-navy">1.5x Pay</p>
          <p className="text-xs text-slate-500">Premium for urgent work</p>
        </Card>
        <Card className="p-5 text-center">
          <Phone className="mx-auto h-8 w-8 text-brand-orange" />
          <p className="mt-2 font-bold text-brand-navy">Direct Call</p>
          <p className="text-xs text-slate-500">Customers can call immediately</p>
        </Card>
        <Card className="p-5 text-center">
          <MapPin className="mx-auto h-8 w-8 text-brand-orange" />
          <p className="mt-2 font-bold text-brand-navy">Priority Listing</p>
          <p className="text-xs text-slate-500">Show first in search results</p>
        </Card>
      </div>
    </div>
  );
}
