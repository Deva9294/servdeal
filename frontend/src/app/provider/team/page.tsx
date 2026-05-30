'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Users, Plus, Trash2, Star } from 'lucide-react';

interface TeamMember {
  worker: { _id: string; name: string; avatar: string; skills: string[]; experienceYears: number };
  role: string;
}

interface TeamData {
  _id: string;
  name: string;
  description: string;
  members: TeamMember[];
  skills: string[];
  rating: number;
  totalJobs: number;
  isAvailable: boolean;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', skills: '' });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const { data } = await api.get('/teams/me');
      setTeam(data.team);
    } catch {
      // No team yet
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async () => {
    try {
      await api.post('/teams', {
        name: form.name,
        description: form.description,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      toast.success('Team created');
      setCreating(false);
      fetchTeam();
    } catch {
      toast.error('Failed to create team');
    }
  };

  if (loading) return <div className="text-center py-12 text-slate-500">Loading...</div>;

  if (!team) {
    return (
      <div className="mx-auto max-w-xl">
        <PageHeader title="My Team" description="Create a team to take on bigger projects" />
        <Card className="p-8 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-3 text-slate-500">You are not part of any team yet.</p>
          {!creating ? (
            <Button className="mt-4" onClick={() => setCreating(true)}><Plus className="h-4 w-4 mr-1" /> Create Team</Button>
          ) : (
            <div className="mt-4 space-y-3 text-left">
              <Input placeholder="Team name" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Description" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} />
              <Input placeholder="Skills (comma separated)" value={form.skills} onChange={(e: any) => setForm({ ...form, skills: e.target.value })} />
              <div className="flex gap-2">
                <Button onClick={createTeam}>Create</Button>
                <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={team.name} description={team.description || 'Your team dashboard'} />
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="p-5 text-center">
          <p className="text-2xl font-bold text-brand-navy">{team.members.length}</p>
          <p className="text-xs text-slate-500">Members</p>
        </Card>
        <Card className="p-5 text-center">
          <p className="text-2xl font-bold text-brand-navy">{team.totalJobs}</p>
          <p className="text-xs text-slate-500">Jobs Completed</p>
        </Card>
        <Card className="p-5 text-center">
          <div className="flex items-center justify-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <p className="text-2xl font-bold text-brand-navy">{team.rating.toFixed(1)}</p>
          </div>
          <p className="text-xs text-slate-500">Team Rating</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 font-bold text-brand-navy">Team Members</h3>
        <div className="space-y-3">
          {team.members.map((m) => (
            <div key={m.worker._id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white font-bold">
                  {m.worker.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-brand-navy">{m.worker.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{m.role} • {m.worker.experienceYears} yrs exp</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize">{m.role}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
