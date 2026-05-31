'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Users, Wrench, Calendar, DollarSign, Clock, TrendingUp, TrendingDown, ShieldCheck, Eye, CheckCircle, XCircle } from 'lucide-react';
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
    { label: 'Pending Verifications', value: stats.pendingVerifications || 0, trend: null, up: null, icon: ShieldCheck, color: 'bg-amber-100 text-amber-600' },
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

  const subStats = [
    { label: 'Completed Bookings', value: stats.bookingStats?.completed?.toLocaleString('en-IN') || '0', icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Cancelled Bookings', value: stats.bookingStats?.cancelled?.toLocaleString('en-IN') || '0', icon: XCircle, color: 'bg-red-50 text-red-600' },
    { label: 'Total Revenue', value: `₹${((stats.totalEarnings || 0) / 100000).toFixed(2)}L`, icon: DollarSign, color: 'bg-blue-50 text-blue-600' },
    { label: 'This Month Revenue', value: `₹${((stats.totalEarnings || 0) / 100000 / 12).toFixed(2)}L`, icon: DollarSign, color: 'bg-purple-50 text-purple-600' },
  ];

  const getInitials = (name: string) => name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const avatarColors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500'];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {statCards.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex justify-between">
              <div className={`rounded-xl p-2 ${s.color}`}><s.icon className="h-5 w-5" /></div>
              {s.trend !== null && (
                <span className={`flex items-center gap-1 text-xs ${s.up ? 'text-green-600' : 'text-red-600'}`}>
                  {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {s.trend}
                </span>
              )}
            </div>
            <p className="mt-3 text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts + Recent Bookings */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold">Bookings Overview</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyBookings?.map((d: { _id: number; count: number }) => ({ day: d._id, count: d.count })) || []}>
                <defs>
                  <linearGradient id="adminChart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0b1f4d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0b1f4d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#0b1f4d" strokeWidth={2} fill="url(#adminChart)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">Recent Bookings</h3>
          <div className="mt-4 space-y-3">
            {(stats.recentBookings || []).length === 0 && <p className="text-sm text-slate-500">No recent bookings.</p>}
            {(stats.recentBookings || []).slice(0, 5).map((b: { bookingId: string; service: { name: string }; customer: { name: string; avatar?: string }; status: string; amount: number }) => (
              <div key={b.bookingId} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-bold ${avatarColors[b.bookingId?.length % avatarColors.length]}`}>
                    {getInitials(b.customer?.name)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{b.customer?.name}</p>
                    <p className="text-xs text-slate-500">{b.service?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge status={b.status} className="text-xs">{b.status}</Badge>
                  <p className="text-sm font-bold">{formatCurrency(b.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sub Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {subStats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-full p-2.5 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Top Providers + Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Top Providers</h3>
          </div>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500 text-xs uppercase">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Provider</th>
                <th className="pb-3 font-medium">Bookings</th>
                <th className="pb-3 font-medium">Rating</th>
                <th className="pb-3 font-medium">Earnings</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {(stats.topProviders || []).map((p: { user: { name: string }; completedJobs: number; rating: number; totalEarnings: number }, i: number) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3 text-slate-500">{i + 1}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold ${avatarColors[i % avatarColors.length]}`}>
                        {getInitials(p.user?.name)}
                      </div>
                      <span className="font-medium">{p.user?.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{p.completedJobs}</td>
                  <td className="py-3 flex items-center gap-1">
                    <span className="text-amber-500">★</span> {p.rating}
                  </td>
                  <td className="py-3 font-medium">{formatCurrency(p.totalEarnings)}</td>
                  <td className="py-3"><Badge status="active" className="text-xs">Active</Badge></td>
                  <td className="py-3">
                    <button className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-500">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
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
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
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
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
