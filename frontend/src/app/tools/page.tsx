'use client';

import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Wrench, MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import { SkeletonPulse } from '@/components/ui/SkeletonCard';

interface ToolItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  pricePerDay: number;
  condition: string;
  location: { city: string };
  owner: { name: string; city: string };
  rating: number;
}

export default function ToolsPage() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const { data } = await api.get('/tools');
      setTools(data.tools || []);
    } catch {
      toast.error('Failed to load tools');
    } finally {
      setLoading(false);
    }
  };

  const filtered = tools.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-brand-navy to-blue-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-4">
            <Wrench className="h-8 w-8 text-brand-orange" />
          </div>
          <h1 className="text-3xl font-bold">Tool Rental Marketplace</h1>
          <p className="mt-2 text-white/70">Rent professional tools by the day. Save money, get the job done.</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12">

        <div className="mx-auto mb-8 max-w-lg">
          <Input
            placeholder="Search tools..."
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        {loading ? (
          <SkeletonPulse />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filtered.map((tool) => (
              <Card key={tool._id} className="overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <Wrench className="h-12 w-12 text-white/80" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 capitalize">{tool.category}</span>
                    <span className="text-xs text-slate-500">{tool.condition}</span>
                  </div>
                  <h3 className="mt-2 font-bold text-brand-navy">{tool.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{tool.description}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" /> {tool.location?.city || tool.owner?.city}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold text-brand-orange">₹{tool.pricePerDay}<span className="text-xs text-slate-500 font-normal">/day</span></p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-slate-500">{tool.rating || 'New'}</span>
                    </div>
                  </div>
                  <Link href={`/tools/${tool.slug}`} className="mt-3 block">
                    <Button size="sm" className="w-full">Rent Now</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
