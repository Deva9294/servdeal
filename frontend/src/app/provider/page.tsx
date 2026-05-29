'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Calendar, CheckCircle, Clock, Wallet, ChevronRight } from 'lucide-react';

const earningsData = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  amount: 400 + Math.random() * 600,
}));

const upcoming = [
  { time: '10:00 AM', service: 'Electrical Wiring Repair', customer: 'Aman Kumar', location: 'Patna', status: 'confirmed' },
  { time: '12:30 PM', service: 'Fan Installation', customer: 'Priya S.', location: 'Patna', status: 'pending' },
  { time: '3:00 PM', service: 'Switch Board Repair', customer: 'Rahul V.', location: 'Danapur', status: 'confirmed' },
];

const myServices = [
  'Electrical Wiring', 'Light Installation', 'Fan Repair', 'Switch Board Repair',
];

export default function ProviderDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Bookings', value: '128', change: '+18%', icon: Calendar, color: 'text-blue-600 bg-blue-100' },
          { label: 'Completed', value: '112', change: '+20%', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
          { label: 'Pending Today', value: '8', change: 'View all', icon: Clock, color: 'text-orange-600 bg-orange-100' },
          { label: 'Total Earnings', value: formatCurrency(18750), change: '+15%', icon: Wallet, color: 'text-purple-600 bg-purple-100' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs text-green-600">{stat.change}</p>
              </div>
              <div className={`rounded-xl p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold text-brand-navy">Earnings Overview</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="orange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7a00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff7a00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#ff7a00" fill="url(#orange)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 text-sm">
            <span>Total: {formatCurrency(18750)}</span>
            <span>Charges: {formatCurrency(1875)}</span>
            <span className="font-semibold text-green-600">Net: {formatCurrency(16875)}</span>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-brand-navy">Upcoming Bookings</h3>
          <div className="mt-4 space-y-3">
            {upcoming.map((b, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
                <div className="text-center">
                  <p className="text-xs font-bold text-brand-orange">{b.time}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{b.service}</p>
                  <p className="text-xs text-slate-500">{b.customer} · {b.location}</p>
                </div>
                <Badge status={b.status}>{b.status}</Badge>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-brand-navy">My Services</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {myServices.map((s) => (
            <div key={s} className="flex items-center justify-between rounded-xl border p-3">
              <span className="font-medium">{s}</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-green-500 peer-checked:bg-green-500" />
              </label>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-4">+ Add New Service</Button>
      </Card>

      <Card className="flex items-center justify-between bg-orange-50 p-6">
        <div>
          <p className="font-bold text-brand-navy">Become a Top Rated Provider</p>
          <p className="text-sm text-slate-600">Complete more bookings and earn 5-star reviews</p>
        </div>
        <Button>Know More</Button>
      </Card>
    </div>
  );
}
