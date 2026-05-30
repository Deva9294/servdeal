'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Image, Star, Trash2 } from 'lucide-react';
import { SkeletonPulse } from '@/components/ui/SkeletonCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface WorkEntry {
  _id: string;
  title: string;
  description: string;
  serviceName: string;
  images: string[];
  clientName: string;
  clientRating: number;
  amount: number;
  workedAt: string;
  isFeatured: boolean;
}

export default function PortfolioPage() {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', serviceName: '', clientName: '', clientRating: 5 });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await api.get('/work-history/me');
      setEntries(data.entries || []);
    } catch {
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async () => {
    try {
      await api.post('/work-history', form);
      toast.success('Entry added');
      setShowForm(false);
      setForm({ title: '', description: '', serviceName: '', clientName: '', clientRating: 5 });
      fetchEntries();
    } catch {
      toast.error('Failed to add entry');
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await api.delete(`/work-history/${id}`);
      toast.success('Deleted');
      fetchEntries();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <SkeletonPulse />;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <PageHeader title="Work History & Portfolio" description="Showcase your best work to customers" />
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Add Work</Button>
      </div>

      {showForm && (
        <Card className="mb-6 p-6 space-y-4">
          <h3 className="font-bold text-brand-navy">Add Work Entry</h3>
          <Input placeholder="Title" value={form.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Description" className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none" rows={3} value={form.description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Service name" value={form.serviceName} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, serviceName: e.target.value })} />
            <Input placeholder="Client name" value={form.clientName} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, clientName: e.target.value })} />
          </div>
          <div className="flex gap-3">
            <Button onClick={addEntry}>Save Entry</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {entries.length === 0 ? (
        <EmptyState icon={Image} title="No Portfolio Entries" description="No portfolio entries yet. Add your first work!" actionLabel="Add Work" onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <Card key={entry._id} className={`p-5 ${entry.isFeatured ? 'ring-2 ring-brand-orange' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-brand-navy">{entry.title}</h3>
                  <p className="text-sm text-slate-500">{entry.serviceName}</p>
                </div>
                <button onClick={() => deleteEntry(entry._id)} className="text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
              <p className="mt-2 text-sm text-slate-700">{entry.description}</p>
              {entry.clientRating > 0 && (
                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < entry.clientRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                  ))}
                  <span className="ml-1 text-sm text-slate-500">{entry.clientName}</span>
                </div>
              )}
              {entry.amount > 0 && <p className="mt-2 text-sm font-semibold text-brand-orange">₹{entry.amount}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
