'use client';

import { useState, type ChangeEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/Skeleton';
import { Search, ShieldCheck, ShieldX, Eye } from 'lucide-react';

interface ProviderProfile {
  _id: string;
  user: { name: string; email: string; phone: string; avatar?: string };
  overallStatus: string;
  kycStatus: string;
  bankStatus: string;
  rating: number;
  completedJobs: number;
  skills: Array<{ name: string }>;
  aadhaarDoc?: { url: string };
  panDoc?: { url: string };
  adminNotes?: string;
  rejectionReason?: string;
}

export default function AdminProvidersPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<ProviderProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-providers', filter],
    queryFn: async () => {
      const res = await api.get('/providers/admin/all', {
        params: filter ? { search: filter } : {},
      });
      return res.data;
    },
  });

  const providers: ProviderProfile[] = data?.profiles || [];

  const handleAction = async (id: string, status: string, reason?: string) => {
    setActionLoading(id);
    try {
      await api.patch(`/providers/admin/${id}/verify`, {
        status,
        rejectionReason: reason,
      });
      toast.success(status === 'approved' ? 'Provider approved' : 'Provider rejected');
      qc.invalidateQueries({ queryKey: ['admin-providers'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setSelected(null);
      setRejectReason('');
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge status="active">Approved</Badge>;
      case 'pending_approval': return <Badge status="pending">Pending</Badge>;
      case 'rejected': return <Badge status="cancelled">Rejected</Badge>;
      case 'suspended': return <Badge status="cancelled">Suspended</Badge>;
      default: return <Badge status="pending">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-brand-navy">Provider Verification</h1>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search providers..."
            className="pl-10"
            value={filter}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}><Skeleton className="h-24" /></div>
          ))}
        </div>
      )}

      {!isLoading && providers.length === 0 && (
        <p className="text-sm text-slate-500">No providers found.</p>
      )}

      <div className="space-y-3">
        {providers.map((p) => (
          <Card key={p._id} className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                {p.user?.name?.[0] || 'P'}
              </div>
              <div>
                <p className="font-semibold">{p.user?.name}</p>
                <p className="text-sm text-slate-500">{p.user?.email} · {p.user?.phone || 'No phone'}</p>
                <p className="text-xs text-slate-400">
                  {p.skills?.[0]?.name || 'No skills'} · ★ {p.rating || 0} · {p.completedJobs || 0} jobs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {statusBadge(p.overallStatus)}
              {p.overallStatus === 'pending_approval' && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => handleAction(p._id, 'approved')}
                    disabled={actionLoading === p._id}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Verify
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => { setSelected(p); setRejectReason(''); }}
                    disabled={actionLoading === p._id}
                  >
                    <ShieldX className="h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
              {p.overallStatus === 'rejected' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => handleAction(p._id, 'approved')}
                  disabled={actionLoading === p._id}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Approve
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => setSelected(p)} title="View Details">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Reject Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md space-y-4 p-6">
            <h3 className="text-lg font-bold text-brand-navy">
              {selected.overallStatus === 'pending_approval' ? 'Reject Provider' : 'Provider Details'}
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {selected.user?.name}</p>
              <p><span className="font-medium">Email:</span> {selected.user?.email}</p>
              <p><span className="font-medium">Status:</span> {selected.overallStatus}</p>
              <p><span className="font-medium">KYC:</span> {selected.kycStatus}</p>
              <p><span className="font-medium">Bank:</span> {selected.bankStatus}</p>
              {selected.rejectionReason && (
                <p className="text-red-600"><span className="font-medium">Rejection Reason:</span> {selected.rejectionReason}</p>
              )}
              {selected.adminNotes && (
                <p><span className="font-medium">Admin Notes:</span> {selected.adminNotes}</p>
              )}
              {(selected.aadhaarDoc?.url || selected.panDoc?.url) && (
                <div className="space-y-2 pt-2">
                  <p className="font-medium">Documents:</p>
                  {selected.aadhaarDoc?.url && (
                    <a href={selected.aadhaarDoc.url} target="_blank" rel="noreferrer" className="block text-brand-orange underline">View Aadhaar</a>
                  )}
                  {selected.panDoc?.url && (
                    <a href={selected.panDoc.url} target="_blank" rel="noreferrer" className="block text-brand-orange underline">View PAN</a>
                  )}
                </div>
              )}
            </div>
            {selected.overallStatus === 'pending_approval' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Rejection Reason (optional)</label>
                <textarea
                  className="w-full rounded-xl border p-3 text-sm"
                  rows={2}
                  value={rejectReason}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRejectReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                />
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setSelected(null); setRejectReason(''); }}>
                Close
              </Button>
              {selected.overallStatus === 'pending_approval' && (
                <Button
                  variant="destructive"
                  onClick={() => handleAction(selected._id, 'rejected', rejectReason || undefined)}
                  disabled={actionLoading === selected._id}
                >
                  Reject Provider
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
