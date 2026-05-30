'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Star, CheckCircle, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface ProviderProfile {
  overallStatus: string;
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  bio?: string;
  aadhaarDoc?: { url: string };
  panDoc?: { url: string };
  skills: Array<{ name: string; certificates?: Array<{ url: string }> }>;
}

export default function ProviderProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bio, setBio] = useState('');
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/providers/profile/me');
      setProfile(data.profile);
      setBio(data.profile.bio || '');
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleDocUpload = async (docType: string, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.');
      return;
    }
    setUploadingDoc(docType);
    const fd = new FormData();
    fd.append('document', file);
    fd.append('docType', docType);
    try {
      await api.post('/providers/document', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`${docType.toUpperCase()} uploaded successfully`);
      fetchProfile();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Upload failed');
    } finally {
      setUploadingDoc(null);
      const ref = fileRefs.current[docType];
      if (ref) ref.value = '';
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.post('/providers/profile', { bio });
      toast.success('Profile saved');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-600">Loading profile...</div>;
  }

  const hasAadhaar = Boolean(profile?.aadhaarDoc?.url);
  const hasPan = Boolean(profile?.panDoc?.url);
  const hasCert = profile?.skills?.some((s) => s.certificates && s.certificates.length > 0);

  const docCards = [
    { key: 'aadhaar', label: 'Aadhaar', has: hasAadhaar },
    { key: 'pan', label: 'PAN', has: hasPan },
    { key: 'certificate', label: 'Skill Certificate', has: hasCert },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold text-brand-navy">My Profile</h1>

      <Card className="flex items-center gap-6 p-6">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-navy text-3xl text-white">
            {user?.name?.[0] || 'P'}
          </div>
          <Badge status="active" className="absolute -bottom-1 left-1/2 -translate-x-1/2">
            {profile?.isAvailable ? 'Online' : 'Offline'}
          </Badge>
        </div>
        <div>
          <h2 className="text-xl font-bold">{user?.name || 'Provider'}</h2>
          <p className="text-slate-500">{profile?.skills?.[0]?.name || 'Service Provider'}</p>
          <p className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-brand-orange text-brand-orange" /> {profile?.rating || 0} ({profile?.reviewCount || 0} reviews)
          </p>
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <h3 className="font-semibold">About</h3>
        <textarea
          className="w-full rounded-xl border p-3 text-sm"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Describe your experience and skills..."
        />
        <Button onClick={saveProfile} disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold">Verification Documents</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {docCards.map((d) => (
            <div key={d.key} className="rounded-xl border border-dashed p-4 text-center text-sm">
              <p className="font-medium flex items-center justify-center gap-1">
                {d.has ? <CheckCircle className="h-4 w-4 text-green-500" /> : <FileText className="h-4 w-4 text-slate-400" />}
                {d.label}
              </p>
              {d.has && <p className="mt-1 text-xs text-green-600">Uploaded</p>}
              <input
                ref={(el) => { fileRefs.current[d.key] = el; }}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleDocUpload(d.key, file);
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                disabled={uploadingDoc === d.key}
                onClick={() => fileRefs.current[d.key]?.click()}
              >
                {uploadingDoc === d.key ? 'Uploading...' : d.has ? 'Re-upload' : 'Upload'}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
