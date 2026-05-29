'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

export default function AdminUsersPage() {
  const { data } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/users');
        return res.data.data;
      } catch {
        return [
          { name: 'Aman Kumar', email: 'customer@servdeal.com', phone: '8888888888', role: 'customer', isBlocked: false },
          { name: 'Rohit Kumar', email: 'rohit@email.com', phone: '9876543210', role: 'provider', isBlocked: false },
        ];
      }
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">User Management</h1>
        <Input placeholder="Search users..." className="max-w-xs" />
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b bg-slate-50 text-left"><th className="p-3">Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {(data || []).map((u: { name: string; email: string; phone: string; role: string; isBlocked: boolean }, i: number) => (
              <tr key={i} className="border-b">
                <td className="p-3 font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td className="capitalize">{u.role}</td>
                <td><Badge status={u.isBlocked ? 'cancelled' : 'active'}>{u.isBlocked ? 'Blocked' : 'Active'}</Badge></td>
                <td><button className="text-brand-orange text-sm">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
