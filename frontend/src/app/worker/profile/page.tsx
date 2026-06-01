'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Upload, MapPin, Phone, UserCircle } from 'lucide-react';

export default function WorkerProfilePage() {
  const { user } = useAuth();
  const [avatar, setAvatar] = useState<string>(user?.avatar || '');
  const [uploading, setUploading] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large. Max 2MB.');
      return;
    }
    setUploading(true);
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
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.patch('/users/me', { phone, city });
      toast.success('Profile saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-xl font-bold text-brand-navy">My Profile</h2>

      <Card className="p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatar ? (
              <img src={avatar} alt="Profile" className="h-24 w-24 rounded-full object-cover border-2 border-brand-orange" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange text-3xl font-bold">
                {(user?.name || 'W').charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-orange text-white shadow hover:bg-brand-orange/90">
              <Upload className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
              />
            </label>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user?.name || 'Worker'}</h3>
            <p className="text-sm text-slate-500">{user?.email || 'No email'}</p>
            {uploading && <p className="mt-1 text-xs text-brand-orange">Uploading...</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-brand-navy">Personal Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2"><Phone className="h-4 w-4 text-brand-orange" /> Phone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-orange" /> City</label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Your city" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2"><UserCircle className="h-4 w-4 text-brand-orange" /> Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <Button onClick={saveProfile} disabled={saving} className="bg-brand-orange hover:bg-brand-orange/90">
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-brand-navy">Documents</h3>
        <p className="text-sm text-slate-500 mt-1">Upload your ID and skill certificates here.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center hover:bg-slate-50 transition cursor-pointer">
            <Upload className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-medium">Aadhaar Card</p>
            <p className="text-xs text-slate-500">PDF or JPG, max 5MB</p>
          </div>
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center hover:bg-slate-50 transition cursor-pointer">
            <Upload className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-medium">Skill Certificate</p>
            <p className="text-xs text-slate-500">PDF or JPG, max 5MB</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
