'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Users, Wrench, Calendar, DollarSign, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';

const COLORS = ['#ff7a00', '#0b1f4d', '#94a3b8', '#22c55e'];

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-red-500">Failed to load dashboard data. Please refresh.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers?.toLocaleString('en-IN'), trend: '+18.5%', up: true, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total Providers', value: stats.totalProviders?.toLocaleString('en-IN'), trend: '+14.3%', up: true, icon: Wrench, color: 'bg-green-100 text-green-600' },
    { label: 'Total Bookings', value: stats.totalBookings?.toLocaleString('en-IN'), trend: '+20.8%', up: true, icon: Calendar, color: 'bg-purple-100 text-purple-600' },
    { label: 'Total Earnings', value: formatCurrency(stats.totalEarnings || 0), trend: '+22.5%', up: true, icon: DollarSign, color: 'bg-orange-100 text-orange-600' },
    { label: 'Pending Bookings', value: stats.pendingBookings, trend: '-8.4%', up: false, icon: Clock, color: 'bg-red-100 text-red-600' },
  ];

  const userPie = [
    { name: 'Customers', value: stats.userStats?.customers || 80 },
    { name: 'Providers', value: stats.userStats?.providers || 13 },
    { name: 'Blocked', value: stats.userStats?.blocked || 7 },
  ];

  const bookingPie = [
    { name: 'Completed', value: stats.bookingStats?.completed || 77 },
    { name: 'Confirmed', value: stats.bookingStats?.confirmed || 16 },
    { name: 'Pending', value: stats.bookingStats?.pending || 2 },
    { name: 'Cancelled', value: stats.bookingStats?.cancelled || 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex justify-between">
              <div className={`rounded-xl p-2 ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <span className={`flex items-center gap-1 text-xs ${s.up ? 'text-green-600' : 'text-red-600'}`}>
                {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {s.trend}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Bookings Overview</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyBookings?.map((d: { _id: number; count: number }) => ({ day: d._id, count: d.count })) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#0b1f4d" fill="#0b1f4d" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">Recent Bookings</h3>
          <div className="mt-4 space-y-3">
            {(stats.recentBookings || []).length === 0 && <p className="text-sm text-slate-500">No recent bookings.</p>}
            {(stats.recentBookings || []).slice(0, 5).map((b: { bookingId: string; service: { name: string }; customer: { name: string }; status: string; amount: number }) => (
              <div key={b.bookingId} className="flex items-center justify-between border-b pb-3">
                <div>
                  <p className="font-medium">#{b.bookingId}</p>
                  <p className="text-xs text-slate-500">{b.service?.name} · {b.customer?.name}</p>
                </div>
                <div className="text-right">
                  <Badge status={b.status}>{b.status}</Badge>
                  <p className="text-sm font-bold">{formatCurrency(b.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Top Providers</h3>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-2">#</th><th>Provider</th><th>Bookings</th><th>Rating</th><th>Earnings</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(stats.topProviders || []).map((p: { user: { name: string }; completedJobs: number; rating: number; totalEarnings: number }, i: number) => (
                <tr key={i} className="border-b">
                  <td className="py-3">{i + 1}</td>
                  <td className="font-medium">{p.user?.name}</td>
                  <td>{p.completedJobs}</td>
                  <td>★ {p.rating}</td>
                  <td>{formatCurrency(p.totalEarnings)}</td>
                  <td><Badge status="active">Active</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div className="grid gap-4">
          <Card className="p-5">
            <h3 className="font-semibold">User Statistics</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={userPie} dataKey="value" innerRadius={50} outerRadius={70}>
                    {userPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold">Booking Status</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bookingPie} dataKey="value" innerRadius={50} outerRadius={70}>
                    {bookingPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
