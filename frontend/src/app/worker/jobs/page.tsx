'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { MapPin, IndianRupee, Clock, Briefcase } from 'lucide-react';

type Job = {
  _id: string;
  title: string;
  description?: string;
  city?: string;
  paymentType: string;
  workType: string;
  budgetMin?: number;
  budgetMax?: number;
  location?: { coordinates?: number[] };
  createdAt?: string;
};

export default function WorkerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs');
      setJobs(res.data.jobs || []);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const applyJob = async (jobId: string) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      setApplied((prev) => new Set(prev).add(jobId));
      toast.success('Applied successfully');
    } catch {
      toast.error('Could not apply to this job');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-navy">Available Jobs</h2>
        <Button variant="outline" onClick={loadJobs} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job._id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-brand-orange" />
                  <h3 className="font-semibold text-brand-navy">{job.title}</h3>
                </div>
                <p className="mt-1 text-sm text-slate-600">{job.description || 'No description provided.'}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.city || 'Local'}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {job.workType}</span>
                  <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" /> ₹{job.budgetMin || 0} - ₹{job.budgetMax || 0}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100">{job.paymentType}</span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => applyJob(job._id)}
                disabled={applied.has(job._id)}
                className={applied.has(job._id) ? 'bg-green-600 hover:bg-green-600' : 'bg-brand-orange hover:bg-brand-orange/90'}
              >
                {applied.has(job._id) ? 'Applied' : 'Apply'}
              </Button>
            </div>
          </Card>
        ))}
        {jobs.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-3 text-slate-500">No jobs available right now.</p>
            <Button variant="outline" className="mt-4" onClick={loadJobs}>Refresh</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
