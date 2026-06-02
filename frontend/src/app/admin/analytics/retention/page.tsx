'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Repeat, TrendingUp, Activity, DollarSign, Calendar } from 'lucide-react';
import api from '@/lib/api';

export default function RetentionAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-retention'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics/retention');
      return res.data.data;
    },
  });

  const statCards = [
    { label: 'Total Customers', value: data?.totalCustomers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Repeat Customers', value: data?.repeatCustomers || 0, icon: Repeat, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Repeat Rate', value: `${data?.repeatRate || 0}%`, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Active (30d)', value: data?.active30Days || 0, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Churn Rate', value: `${data?.churnRate || 0}%`, icon: Calendar, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Avg LTV', value: `₹${Math.round(data?.avgLifetimeValue || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Customer Retention Analytics</h1>
      <p className="text-slate-500">Understand customer loyalty and lifetime value</p>

      {isLoading ? (
        <div className="mt-8 text-center text-slate-500">Loading analytics...</div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-slate-100 bg-white p-5"
              >
                <div className={`inline-flex rounded-lg ${s.bg} p-2`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <p className="mt-3 text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Monthly Retention Trend</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="pb-3 font-medium">Month</th>
                    <th className="pb-3 font-medium">Total Customers</th>
                    <th className="pb-3 font-medium">Repeat Customers</th>
                    <th className="pb-3 font-medium">Retention Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.monthlyRetention?.map((m: { month: string; totalCustomers: number; repeatCustomers: number; retentionRate: number }) => (
                    <tr key={m.month}>
                      <td className="py-3 font-medium text-slate-900">{m.month}</td>
                      <td className="py-3 text-slate-600">{m.totalCustomers}</td>
                      <td className="py-3 text-slate-600">{m.repeatCustomers}</td>
                      <td className="py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          m.retentionRate >= 50 ? 'bg-emerald-100 text-emerald-700' :
                          m.retentionRate >= 30 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {m.retentionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
