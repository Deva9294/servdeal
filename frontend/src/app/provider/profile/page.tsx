'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Star, CheckCircle, FileText, ShieldCheck, ShieldX, Clock, Send, Upload, Camera, X } from 'lucide-react';
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
  const [submitting, setSubmitting] = useState(false);
  const [bio, setBio] = useState('');
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string>(user?.avatar || '');
  const [shopPhotos, setShopPhotos] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
      await fetchProfile();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large. Max 2MB.');
      return;
    }
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const res = await api.post('/users/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAvatar(res.data.avatar);
      toast.success('Profile photo updated');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleShopPhotoUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image too large. Max 5MB.');
      return;
    }
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append('photo', file);
    try {
      const res = await api.post('/providers/shop-photo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShopPhotos((prev) => [...prev, res.data.url]);
      toast.success('Shop photo added');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removeShopPhoto = (url: string) => {
    setShopPhotos((prev) => prev.filter((p) => p !== url));
  };

  const submitForVerification = async () => {
    setSubmitting(true);
    try {
      await api.post('/providers/profile', { bio, requestVerification: true });
      toast.success('Verification request submitted!');
      await fetchProfile();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Submission failed');
    } finally {
      setSubmitting(false);
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
          {avatar ? (
            <img src={avatar} alt="Profile" className="h-24 w-24 rounded-full object-cover border-2 border-brand-orange" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-navy text-3xl text-white">
              {user?.name?.[0] || 'P'}
            </div>
          )}
          <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white shadow hover:bg-brand-orange/90">
            <Camera className="h-4 w-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
            />
          </label>
          <div className="absolute -right-2 -top-2">
            {profile?.overallStatus === 'approved' && <ShieldCheck className="h-5 w-5 text-green-500" />}
            {profile?.overallStatus === 'pending_approval' && <Clock className="h-5 w-5 text-amber-500" />}
            {profile?.overallStatus === 'rejected' && <ShieldX className="h-5 w-5 text-red-500" />}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">{user?.name || 'Provider'}</h2>
          <p className="text-slate-500">{profile?.skills?.[0]?.name || 'Service Provider'}</p>
          <p className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-brand-orange text-brand-orange" /> {profile?.rating || 0} ({profile?.reviewCount || 0} reviews)
          </p>
          {uploadingPhoto && <p className="mt-1 text-xs text-brand-orange">Uploading...</p>}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold flex items-center gap-2"><Camera className="h-4 w-4 text-brand-orange" /> Shop Photos</h3>
        <p className="text-sm text-slate-500 mt-1">Upload photos of your shop/workspace to build customer trust.</p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {shopPhotos.map((url) => (
            <div key={url} className="relative group rounded-xl overflow-hidden aspect-square">
              <img src={url} alt="Shop" className="h-full w-full object-cover" />
              <button
                onClick={() => removeShopPhoto(url)}
                className="absolute top-2 right-2 rounded-full bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 aspect-square cursor-pointer hover:bg-slate-50 transition">
            <Upload className="h-8 w-8 text-slate-400" />
            <span className="mt-2 text-xs text-slate-500">Add Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleShopPhotoUpload(e.target.files[0])}
            />
          </label>
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

      <Card className="p-6">
        <h3 className="font-semibold">Verification Status</h3>
        <div className="mt-4 flex items-center gap-3">
          {profile?.overallStatus === 'approved' && (
            <>
              <ShieldCheck className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium text-green-600">Verified</p>
                <p className="text-xs text-slate-500">Your profile is approved and visible to customers.</p>
              </div>
            </>
          )}
          {profile?.overallStatus === 'pending_approval' && (
            <>
              <Clock className="h-6 w-6 text-amber-500" />
              <div>
                <p className="font-medium text-amber-600">Pending Review</p>
                <p className="text-xs text-slate-500">Your profile is under admin review. Please wait.</p>
              </div>
            </>
          )}
          {profile?.overallStatus === 'rejected' && (
            <>
              <ShieldX className="h-6 w-6 text-red-500" />
              <div>
                <p className="font-medium text-red-600">Rejected</p>
                <p className="text-xs text-slate-500">Your verification was rejected. Update documents and resubmit.</p>
              </div>
            </>
          )}
          {(!profile?.overallStatus || profile?.overallStatus === 'incomplete') && (
            <>
              <FileText className="h-6 w-6 text-slate-400" />
              <div>
                <p className="font-medium text-slate-600">Incomplete</p>
                <p className="text-xs text-slate-500">Upload required documents and submit for verification.</p>
              </div>
            </>
          )}
        </div>
        {profile?.overallStatus !== 'approved' && profile?.overallStatus !== 'pending_approval' && (
          <Button
            className="mt-4 gap-1"
            disabled={submitting || !hasAadhaar || !hasPan}
            onClick={submitForVerification}
          >
            <Send className="h-4 w-4" />
            {submitting ? 'Submitting...' : 'Submit for Verification'}
          </Button>
        )}
        {profile?.overallStatus !== 'approved' && (!hasAadhaar || !hasPan) && (
          <p className="mt-2 text-xs text-red-500">Upload Aadhaar and PAN to enable verification.</p>
        )}
      </Card>
    </div>
  );
}
