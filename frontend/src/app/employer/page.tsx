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
};

type Worker = {
  _id: string;
  user?: {
    name?: string;
    phone?: string;
    city?: string;
  };
  experienceYears?: number;
  expectedDailyWage?: number;
  ratingAvg?: number;
  location?: { coordinates?: number[] };
};

const NearbyMap = dynamic(
  () => import('@/components/maps/NearbyMap').then((mod) => mod.NearbyMap),
  { ssr: false }
);

export default function EmployerPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [budgetMin, setBudgetMin] = useState('500');
  const [budgetMax, setBudgetMax] = useState('1200');
  const [message, setMessage] = useState('');

  const loadPageData = async () => {
    const [skillsRes, workersRes] = await Promise.all([
      api.get('/skills'),
      api.get('/workers/nearby?lng=85.1376&lat=25.5941&radiusKm=20'),
    ]);
    setSkills(skillsRes.data.skills || []);
    setWorkers(workersRes.data.workers || []);
  };

  useEffect(() => {
    loadPageData().catch(() => setMessage('Could not load employer dashboard data.'));
  }, []);

  const registerEmployer = async () => {
    if (!companyName.trim()) {
      toast.error('Please enter company or hirer name.');
      return;
    }

    try {
      await api.post('/employers/register', {
        companyName,
        employerType: 'business',
      });
      setMessage('Employer profile created successfully.');
      toast.success('Employer profile created successfully.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errMsg = error.response?.data?.message || 'Employer profile creation failed.';
      setMessage(errMsg);
      toast.error(errMsg);
    }
  };

  const postJob = async () => {
    if (!jobTitle.trim()) {
      toast.error('Job title is required.');
      return;
    }
    if (Number(budgetMin) <= 0 || Number(budgetMax) <= 0 || Number(budgetMax) < Number(budgetMin)) {
      toast.error('Please enter a valid budget range.');
      return;
    }

    try {
      await api.post('/jobs', {
        title: jobTitle,
        description: jobDescription,
        skills: selectedSkills,
        paymentType: 'daily',
        workType: 'daily',
        budgetMin: Number(budgetMin),
        budgetMax: Number(budgetMax),
        city: 'Patna',
      });
      setMessage('Job posted successfully.');
      toast.success('Job posted successfully.');
      setJobTitle('');
      setJobDescription('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errMsg = error.response?.data?.message || 'Job post failed.';
      setMessage(errMsg);
      toast.error(errMsg);
    }
  };

  const workerMapPoints = workers
    .map((worker) => {
      const coords = worker.location?.coordinates || [];
      if (coords.length !== 2) return null;
      return {
        id: worker._id,
        label: worker.user?.name || 'Worker',
        lat: Number(coords[1]),
        lng: Number(coords[0]),
        meta: `Rs ${worker.expectedDailyWage || 0}/day`,
      };
    })
    .filter(Boolean) as { id: string; label: string; lat: number; lng: number; meta: string }[];

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-brand-navy">Employer Panel</h1>
        <p className="mt-1 text-sm text-slate-600">
          Register employer profile, post jobs, and discover nearby workers.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Employer Registration</h2>
        <div className="mt-4 flex gap-3">
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company or hirer name"
          />
          <Button onClick={registerEmployer}>Create Employer Profile</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-brand-navy">Post New Job</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Job title" />
          <Input
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Job description"
          />
          <Input
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            type="number"
            min={0}
            placeholder="Budget min"
          />
          <Input
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            type="number"
            min={0}
            placeholder="Budget max"
          />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-slate-700">Required Skills</p>
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
        <Button className="mt-4" onClick={postJob}>
          Post Job
        </Button>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-navy">Nearby Workers</h2>
          <Button variant="outline" onClick={() => loadPageData()}>
            Refresh
          </Button>
        </div>
        <div className="mb-4">
          <NearbyMap points={workerMapPoints} />
        </div>
        <div className="space-y-3">
          {workers.map((worker) => (
            <div key={worker._id} className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">{worker.user?.name || 'Worker'}</p>
              <p className="text-sm text-slate-600">
                {worker.user?.city || 'Local area'} · {worker.experienceYears || 0} years experience
              </p>
              <p className="text-xs text-slate-500">
                Expected wage: Rs {worker.expectedDailyWage || 0}/day · Rating: {worker.ratingAvg || 0}
              </p>
            </div>
          ))}
          {workers.length === 0 ? <p className="text-sm text-slate-500">No workers found nearby.</p> : null}
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

