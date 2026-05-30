'use client';

import { useEffect, useState, type ChangeEvent } from 'react';
import { useParams } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Wrench, MapPin, Star, User, Phone } from 'lucide-react';
import { SkeletonPulse } from '@/components/ui/SkeletonCard';

interface ToolDetail {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  pricePerDay: number;
  pricePerWeek: number;
  pricePerMonth: number;
  deposit: number;
  condition: string;
  minRentalDays: number;
  location: { city: string; state: string };
  owner: { name: string; phone: string; city: string; avatar: string };
  rating: number;
  totalRentals: number;
}

export default function ToolDetailPage() {
  const { slug } = useParams();
  const [tool, setTool] = useState<ToolDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);
  const [dates, setDates] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    fetchTool();
  }, [slug]);

  const fetchTool = async () => {
    try {
      const { data } = await api.get(`/tools/${slug}`);
      setTool(data.tool);
    } catch {
      toast.error('Failed to load tool');
    } finally {
      setLoading(false);
    }
  };

  const rent = async () => {
    try {
      await api.post(`/tools/${tool?._id}/rent`, {
        startDate: dates.startDate,
        endDate: dates.endDate,
        deliveryMethod: 'pickup',
      });
      toast.success('Rental request sent!');
      setRenting(false);
    } catch {
      toast.error('Failed to rent tool');
    }
  };

  if (loading) return <PublicLayout><SkeletonPulse /></PublicLayout>;
  if (!tool) return <PublicLayout><div className="text-center py-12 text-slate-500">Tool not found</div></PublicLayout>;

  return (
    <PublicLayout>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <div className="h-64 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <Wrench className="h-20 w-20 text-white/80" />
            </div>
          </div>
          <div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 capitalize">{tool.category}</span>
            <h1 className="mt-2 text-2xl font-bold text-brand-navy">{tool.name}</h1>
            <p className="mt-2 text-slate-500">{tool.description}</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span className="text-sm font-medium">{tool.rating || 'New'}</span></div>
              <div className="flex items-center gap-1"><MapPin className="h-4 w-4 text-slate-400" /><span className="text-sm text-slate-500">{tool.location?.city}</span></div>
            </div>

            <Card className="mt-6 p-5">
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-slate-500">Per Day</span><span className="font-bold">₹{tool.pricePerDay}</span></div>
                {tool.pricePerWeek > 0 && <div className="flex justify-between"><span className="text-slate-500">Per Week</span><span className="font-bold">₹{tool.pricePerWeek}</span></div>}
                {tool.pricePerMonth > 0 && <div className="flex justify-between"><span className="text-slate-500">Per Month</span><span className="font-bold">₹{tool.pricePerMonth}</span></div>}
                <div className="flex justify-between"><span className="text-slate-500">Deposit</span><span className="font-bold">₹{tool.deposit}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Condition</span><span className="font-bold capitalize">{tool.condition}</span></div>
              </div>
            </Card>

            <div className="mt-6 flex items-center gap-3 rounded-xl border p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-orange text-white"><User className="h-5 w-5" /></div>
              <div className="flex-1">
                <p className="font-semibold text-brand-navy">{tool.owner?.name}</p>
                <p className="text-xs text-slate-500">{tool.owner?.city}</p>
              </div>
            </div>

            {!renting ? (
              <Button className="mt-6 w-full" onClick={() => setRenting(true)}>Rent This Tool</Button>
            ) : (
              <Card className="mt-6 p-5 space-y-3">
                <p className="font-bold text-brand-navy">Select Rental Dates</p>
                <input type="date" className="w-full rounded-xl border px-4 py-2 text-sm" value={dates.startDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setDates({ ...dates, startDate: e.target.value })} />
                <input type="date" className="w-full rounded-xl border px-4 py-2 text-sm" value={dates.endDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setDates({ ...dates, endDate: e.target.value })} />
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={rent}>Confirm Rental</Button>
                  <Button variant="ghost" onClick={() => setRenting(false)}>Cancel</Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
