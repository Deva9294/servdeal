'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Sparkles, MapPin, Star, Briefcase, CheckCircle } from 'lucide-react';

interface MatchedJob {
  _id: string;
  bookingId: string;
  service: { name: string };
  amount: number;
  address: { city: string; lat: number; lng: number };
  scheduledAt: string;
  matchScore: number;
  distanceKm: number;
}

export default function AIMatchingPage() {
  const [jobs, setJobs] = useState<MatchedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const { data } = await api.get('/matching/jobs');
      setJobs(data.matches || []);
    } catch {
      toast.error('Failed to load AI matches');
    } finally {
      setLoading(false);
    }
  };

  const acceptJob = async (bookingId: string) => {
    try {
      await api.post(`/job-alerts/respond`, { bookingId, action: 'accept' });
      toast.success('Job accepted!');
      fetchMatches();
    } catch {
      toast.error('Failed to accept job');
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-500">AI is finding best jobs for you...</div>;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="AI Job Matching" description="Smart job recommendations based on your skills and location" />

      <Card className="mb-6 bg-gradient-to-br from-brand-navy to-blue-900 p-6 text-white">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-brand-orange" />
          <div>
            <h3 className="text-lg font-bold">How AI Matching Works</h3>
            <p className="text-sm text-white/80">We analyze your skills, ratings, location, and availability to find the highest-paying jobs near you.</p>
          </div>
        </div>
      </Card>

      {jobs.length === 0 ? (
        <Card className="p-8 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-slate-500">No matching jobs right now. Update your skills to get better matches!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job._id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-orange px-2 py-0.5 text-xs font-bold text-white">{job.matchScore}% Match</span>
                    <span className="text-xs text-slate-500"><MapPin className="inline h-3 w-3" /> {job.distanceKm} km</span>
                  </div>
                  <h3 className="mt-1 font-bold text-brand-navy">{job.service?.name}</h3>
                  <p className="text-sm text-slate-500">Booking #{job.bookingId} • {job.address?.city}</p>
                  <p className="mt-1 text-lg font-bold text-brand-orange">₹{job.amount}</p>
                </div>
                <Button onClick={() => acceptJob(job._id)}><CheckCircle className="h-4 w-4 mr-1" /> Accept Job</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
