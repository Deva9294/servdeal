'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type Skill = {
  _id: string;
  name: string;
  category: string;
};

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
};

const NearbyMap = dynamic(
  () => import('@/components/maps/NearbyMap').then((mod) => mod.NearbyMap),
  { ssr: false }
);

export default function WorkerPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState('1');
  const [expectedDailyWage, setExpectedDailyWage] = useState('800');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    const [skillsRes, jobsRes] = await Promise.all([api.get('/skills'), api.get('/jobs')]);
    setSkills(skillsRes.data.skills || []);
    setJobs(jobsRes.data.jobs || []);
  };

  useEffect(() => {
    loadData().catch(() => setMessage('Could not load worker feed right now.'));
  }, []);

  const registerWorker = async () => {
    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill.');
      return;
    }
    if (Number(expectedDailyWage) <= 0) {
      toast.error('Expected daily wage should be greater than 0.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      await api.post('/workers/register', {
        skills: selectedSkills,
        experienceYears: Number(experienceYears),
        expectedDailyWage: Number(expectedDailyWage),
        availabilityType: 'daily',
      });
      setMessage('Worker profile created successfully.');
      toast.success('Worker profile created successfully.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errMsg = error.response?.data?.message || 'Worker profile creation failed.';
      setMessage(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const applyJob = async (jobId: string) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      setMessage('Applied to job successfully.');
      toast.success('Applied to job successfully.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errMsg = error.response?.data?.message || 'Could not apply to this job.';
      setMessage(errMsg);
      toast.error(errMsg);
    }
  };

  const jobMapPoints = jobs
    .map((job) => {
      const coords = job.location?.coordinates || [];
      if (coords.length !== 2) return null;
      return {
        id: job._id,
        label: job.title,
        lat: Number(coords[1]),
        lng: Number(coords[0]),
        meta: `${job.city || 'Local'} - ${job.paymentType}`,
      };
    })
    .filter(Boolean) as { id: string; label: string; lat: number; lng: number; meta: string }[];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-brand-navy">Worker Panel</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create worker profile, discover nearby jobs, and apply instantly.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Complete Worker Profile</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            type="number"
            min={0}
            placeholder="Experience years"
          />
          <Input
            value={expectedDailyWage}
            onChange={(e) => setExpectedDailyWage(e.target.value)}
            type="number"
            min={0}
            placeholder="Expected daily wage"
          />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-slate-700">Select Skills</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const active = selectedSkills.includes(skill._id);
              return (
                <button
                  key={skill._id}
                  type="button"
                  onClick={() =>
                    setSelectedSkills((prev) =>
                      active ? prev.filter((id) => id !== skill._id) : [...prev, skill._id]
                    )
                  }
                  className={`rounded-full border px-3 py-1 text-sm ${
                    active
                      ? 'border-brand-orange bg-orange-50 text-brand-orange'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {skill.name}
                </button>
              );
            })}
          </div>
        </div>
        <Button className="mt-4" onClick={registerWorker} disabled={loading}>
          {loading ? 'Saving...' : 'Register as Worker'}
        </Button>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-navy">Live Job Feed</h2>
          <Button variant="outline" onClick={() => loadData()}>
            Refresh
          </Button>
        </div>
        <div className="mb-4">
          <NearbyMap points={jobMapPoints} />
        </div>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job._id} className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">{job.title}</p>
              <p className="text-sm text-slate-600">{job.description || 'No description'}</p>
              <p className="mt-1 text-xs text-slate-500">
                {job.city || 'Local'} · {job.workType} · {job.paymentType}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Budget: Rs {job.budgetMin || 0} - Rs {job.budgetMax || 0}
              </p>
              <Button size="sm" className="mt-3" onClick={() => applyJob(job._id)}>
                Apply
              </Button>
            </div>
          ))}
          {jobs.length === 0 ? <p className="text-sm text-slate-500">No open jobs right now.</p> : null}
        </div>
      </Card>

      {message ? (
        <Card className="border-l-4 border-brand-orange p-4">
          <p className="text-sm text-slate-700">{message}</p>
        </Card>
      ) : null}
    </div>
  );
}

