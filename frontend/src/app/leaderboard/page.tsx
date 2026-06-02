'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Star, MapPin, Award, Medal } from 'lucide-react';
import { API_URL } from '@/lib/constants';
import { useState } from 'react';

export default function LeaderboardPage() {
  const [city, setCity] = useState('');

  const { data: providers, isLoading } = useQuery({
    queryKey: ['leaderboard', city],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (city) params.set('city', city);
      params.set('limit', '50');
      const res = await fetch(`${API_URL}/leaderboard/city?${params.toString()}`);
      const json = await res.json();
      return json.data || [];
    },
  });

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-amber-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-700" />;
    return <span className="flex h-6 w-6 items-center justify-center text-sm font-bold text-slate-400">{rank}</span>;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Provider Leaderboard</h1>
        <p className="mt-2 text-slate-500">Top performing service providers on ServDeal</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Filter by city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-orange-500"
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading...</div>
        ) : !providers?.length ? (
          <div className="flex flex-col items-center p-12 text-center">
            <Trophy className="h-12 w-12 text-slate-300" />
            <p className="mt-4 font-medium text-slate-900">No providers found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {providers.map((p: { providerId: string; rank: number; name?: string; avatar?: string; city?: string; services?: string[]; rating: number; completedJobs: number; totalEarnings?: number }, idx: number) => (
              <motion.div
                key={p.providerId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-center gap-4 p-4 transition hover:bg-slate-50"
              >
                <div className="w-8 text-center">{rankIcon(p.rank)}</div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
                  {p.name?.charAt(0) || 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {p.city || '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {p.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{p.completedJobs} jobs</p>
                  <p className="text-xs text-slate-500">₹{p.totalEarnings?.toLocaleString('en-IN')} earned</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
