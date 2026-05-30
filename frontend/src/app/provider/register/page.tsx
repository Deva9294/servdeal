'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

const steps = [
  'Personal Info',
  'KYC Documents',
  'Skills & Services',
  'Bank Details',
  'Schedule',
];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    // Personal
    name: '', email: '', phone: '', password: '',
    dateOfBirth: '', gender: '',
    address: { line1: '', city: '', state: '', pincode: '' },
    primaryServiceArea: '', maxTravelDistanceKm: 10,
    bio: '', languages: 'Hindi, English',

    // KYC
    aadhaarNumber: '', panNumber: '',

    // Skills
    skillName: '', experienceYears: '', hourlyRate: '',

    // Bank
    accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', upiId: '',

    // Schedule
    isAvailable: true,
  });

  const update = (key: string, val: string | number | boolean | object) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const next = () => step < steps.length - 1 && setStep((s) => s + 1);
  const prev = () => step > 0 && setStep((s) => s - 1);

  const submit = async () => {
    setLoading(true);
    try {
      // Step 1: Create account
      const registerRes = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'provider',
      });
      const token = registerRes.data.token;
      localStorage.setItem('token', token);

      // Step 2: Create provider profile
      const profileData = {
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        address: form.address,
        primaryServiceArea: form.primaryServiceArea,
        maxTravelDistanceKm: +form.maxTravelDistanceKm,
        bio: form.bio,
        languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean),
        aadhaarNumber: form.aadhaarNumber,
        panNumber: form.panNumber,
        skills: form.skillName ? [{
          name: form.skillName,
          experienceYears: +form.experienceYears || 0,
          hourlyRate: +form.hourlyRate || 0,
          description: '',
        }] : [],
        bankDetails: {
          accountHolderName: form.accountHolderName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
          bankName: form.bankName,
          upiId: form.upiId,
        },
        isAvailable: form.isAvailable,
      };

      await api.post('/providers/profile', profileData);

      toast.success('Application submitted! Awaiting admin approval.');
      router.push('/provider/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-3">
            <Input placeholder="Full Name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
            <Input type="email" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            <Input type="tel" placeholder="Phone (10 digits)" maxLength={10} value={form.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
            <Input type="password" placeholder="Password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
            <Input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
            <select className="w-full rounded-lg border border-slate-200 p-2.5 text-sm" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <textarea className="w-full rounded-lg border border-slate-200 p-2.5 text-sm" rows={3} placeholder="Bio / About yourself" value={form.bio} onChange={(e) => update('bio', e.target.value)} />
            <Input placeholder="Languages (comma separated)" value={form.languages} onChange={(e) => update('languages', e.target.value)} />
          </div>
        );
      case 1:
        return (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Aadhaar &amp; PAN for KYC verification</p>
            <Input placeholder="Aadhaar Number (12 digits)" maxLength={12} value={form.aadhaarNumber} onChange={(e) => update('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))} />
            <Input placeholder="PAN Number" maxLength={10} value={form.panNumber} onChange={(e) => update('panNumber', e.target.value.toUpperCase().slice(0, 10))} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Add your primary skill/service</p>
            <Input placeholder="Skill / Service Name (e.g. AC Repair, Plumbing)" value={form.skillName} onChange={(e) => update('skillName', e.target.value)} />
            <Input type="number" placeholder="Experience (Years)" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} />
            <Input type="number" placeholder="Hourly Rate (₹)" value={form.hourlyRate} onChange={(e) => update('hourlyRate', e.target.value)} />
            <Input placeholder="Service Area / City" value={form.primaryServiceArea} onChange={(e) => update('primaryServiceArea', e.target.value)} />
            <Input type="number" placeholder="Max Travel Distance (km)" value={form.maxTravelDistanceKm} onChange={(e) => update('maxTravelDistanceKm', e.target.value)} />
          </div>
        );
      case 3:
        return (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Secure bank details for payouts</p>
            <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => update('accountHolderName', e.target.value)} />
            <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => update('accountNumber', e.target.value)} />
            <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => update('ifscCode', e.target.value.toUpperCase())} />
            <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => update('bankName', e.target.value)} />
            <Input placeholder="UPI ID (optional)" value={form.upiId} onChange={(e) => update('upiId', e.target.value)} />
          </div>
        );
      case 4:
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
              <input id="avail" type="checkbox" checked={form.isAvailable} onChange={(e) => update('isAvailable', e.target.checked)} className="h-5 w-5 accent-brand-orange" />
              <label htmlFor="avail" className="text-sm font-medium">I am available to accept bookings now</label>
            </div>
            <p className="text-xs text-slate-500">Your profile will be reviewed by admin before going live.</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <PublicLayout>
      <AuthCard
        title="Become a Provider"
        subtitle={`Step ${step + 1} of ${steps.length}: ${steps[step]}`}
        footer={
          <p className="text-slate-600">
            Already have an account?{' '}
            <Link href="/login?role=provider" className="font-semibold text-brand-orange hover:underline">
              Login
            </Link>
          </p>
        }
      >
        <div className="mb-4 flex gap-1">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-brand-orange' : 'bg-slate-200'}`} />
          ))}
        </div>

        {renderStep()}

        <div className="mt-4 flex gap-3">
          {step > 0 && (
            <Button type="button" variant="outline" className="flex-1" onClick={prev}>
              Back
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button type="button" className="flex-1" onClick={next}>
              Next
            </Button>
          ) : (
            <Button type="button" className="flex-1" onClick={submit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>
      </AuthCard>
    </PublicLayout>
  );
}
