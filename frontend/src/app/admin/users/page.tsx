'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data.data;
    },
  });

  const toggleBlock = async (id: string, current: boolean) => {
    try {
      await api.patch(`/admin/users/${id}`, { isBlocked: !current });
      toast.success(current ? 'User unblocked' : 'User blocked');
      qc.invalidateQueries({ queryKey: ['admin-users'] });
    } catch {
      toast.error('Action failed');
    }
  };

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
            {isLoading ? (
              <tr><td colSpan={6}><Skeleton className="h-10" /></td></tr>
            ) : (
              (users || []).map((u: { _id: string; name: string; email: string; phone: string; role: string; isBlocked: boolean }, i: number) => (
                <tr key={u._id || i} className="border-b">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td className="capitalize">{u.role}</td>
                  <td><Badge status={u.isBlocked ? 'cancelled' : 'active'}>{u.isBlocked ? 'Blocked' : 'Active'}</Badge></td>
                  <td>
                    <button onClick={() => toggleBlock(u._id, u.isBlocked)} className="text-brand-orange text-sm">
                      {u.isBlocked ? 'Unblock' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
