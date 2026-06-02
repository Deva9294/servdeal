'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

interface ServiceItem {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  color?: string;
  basePrice: number;
  description: string;
}

interface ServiceCategory {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  services: ServiceItem[];
}

const stepsNew = [
  'Personal Info',
  'KYC Documents',
  'Shop & Services',
  'Bank Details',
  'Schedule',
];

const stepsExisting = [
  'KYC Documents',
  'Shop & Services',
  'Bank Details',
  'Schedule',
];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [existingUser, setExistingUser] = useState<{name?:string;email?:string;phone?:string}|null>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    dateOfBirth: '', gender: '',
    address: { line1: '', city: '', state: '', pincode: '' },
    primaryServiceArea: '', maxTravelDistanceKm: 10,
    bio: '', languages: 'Hindi, English',

    aadhaarNumber: '', panNumber: '',

    experienceYears: '', hourlyRate: '',

    accountHolderName: '', accountNumber: '', ifscCode: '', bankName: '', upiId: '',

    shopPhoto: null as File | null,
    profilePicture: null as File | null,
    shopLocation: { lat: 0, lng: 0 },
    shopAddress: { line1: '', city: '', state: '', pincode: '' },

    isAvailable: true,
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    aadhaar: null,
    pan: null,
    certificate: null,
  });

  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const steps = isLoggedIn ? stepsExisting : stepsNew;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(({ data }) => {
          setIsLoggedIn(true);
          setExistingUser(data.user);
          setForm((f) => ({
            ...f,
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
          }));
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        });
    }
  }, []);

  // Fetch all categories and services from backend
  useEffect(() => {
    api.get('/services/by-category')
      .then(({ data }) => {
        const cats = data.data || [];
        setCategories(cats);
        const expanded: Record<string, boolean> = {};
        cats.forEach((cat: ServiceCategory) => { expanded[cat._id] = true; });
        setExpandedCategories(expanded);
      })
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const update = (key: string, val: string | number | boolean | object) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const toggleService = (slug: string) => {
    setSelectedServices((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const captureShopLocation = useCallback(() => {
    setLocating(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          shopLocation: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        }));
        toast.success('Shop location captured');
        setLocating(false);
      },
      () => {
        toast.error('Unable to get location');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  const uploadImage = async (file: File, type: 'shopPhoto' | 'profilePicture') => {
    const fd = new FormData();
    fd.append('image', file);
    fd.append('type', type);
    const res = await api.post('/providers/image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url;
  };

  const submit = async () => {
    setLoading(true);
    try {
      // Build skills from selected services
      const selectedServiceNames = categories
        .flatMap((cat) => cat.services)
        .filter((svc) => selectedServices[svc.slug])
        .map((svc) => ({
          name: svc.name,
          experienceYears: +form.experienceYears || 0,
          hourlyRate: +form.hourlyRate || 0,
          description: '',
        }));

      if (selectedServiceNames.length === 0) {
        toast.error('Please select at least one service');
        setLoading(false);
        return;
      }

      if (!isLoggedIn) {
        const registerRes = await api.post('/auth/register', {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: 'provider',
        });
        localStorage.setItem('token', registerRes.data.token);
      }

      // Upload shop photo and profile picture if selected
      let shopPhotoUrl = '';
      let profilePictureUrl = '';
      if (form.shopPhoto) {
        try {
          shopPhotoUrl = await uploadImage(form.shopPhoto, 'shopPhoto');
        } catch {
          toast.error('Shop photo upload failed');
        }
      }
      if (form.profilePicture) {
        try {
          profilePictureUrl = await uploadImage(form.profilePicture, 'profilePicture');
        } catch {
          toast.error('Profile picture upload failed');
        }
      }

      const profileData = {
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        address: form.address,
        primaryServiceArea: form.primaryServiceArea,
        maxTravelDistanceKm: +form.maxTravelDistanceKm,
        bio: form.bio,
        languages: form.languages.split(',').map((l: string) => l.trim()).filter(Boolean),
        aadhaarNumber: form.aadhaarNumber,
        panNumber: form.panNumber,
        skills: selectedServiceNames,
        bankDetails: {
          accountHolderName: form.accountHolderName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
          bankName: form.bankName,
          upiId: form.upiId,
        },
        shopPhoto: shopPhotoUrl,
        profilePicture: profilePictureUrl,
        shopLocation: form.shopLocation,
        shopAddress: form.shopAddress,
        isAvailable: form.isAvailable,
        requestVerification: true,
      };

      await api.post('/providers/profile', profileData);

      // Upload KYC documents if selected
      const docTypes = ['aadhaar', 'pan', 'certificate'] as const;
      for (const docType of docTypes) {
        const file = files[docType];
        if (file) {
          setUploadingDoc(docType);
          const fd = new FormData();
          fd.append('document', file);
          fd.append('docType', docType);
          try {
            await api.post('/providers/document', fd, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          } catch {
            toast.error(`${docType} upload failed, please upload later from profile.`);
          }
          setUploadingDoc(null);
        }
      }

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
    if (!isLoggedIn) {
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
        case 1: return (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Aadhaar &amp; PAN for KYC verification</p>
            <Input placeholder="Aadhaar Number (12 digits)" maxLength={12} value={form.aadhaarNumber} onChange={(e) => update('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))} />
            <label className="block">
              <span className="text-xs text-slate-500">Aadhaar Document (image/PDF, max 5MB)</span>
              <input type="file" accept="image/*,.pdf" className="mt-1 block w-full text-sm" onChange={(e) => setFiles((f) => ({ ...f, aadhaar: e.target.files?.[0] || null }))} />
            </label>
            <Input placeholder="PAN Number" maxLength={10} value={form.panNumber} onChange={(e) => update('panNumber', e.target.value.toUpperCase().slice(0, 10))} />
            <label className="block">
              <span className="text-xs text-slate-500">PAN Document (image/PDF, max 5MB)</span>
              <input type="file" accept="image/*,.pdf" className="mt-1 block w-full text-sm" onChange={(e) => setFiles((f) => ({ ...f, pan: e.target.files?.[0] || null }))} />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">Skill Certificate (image/PDF, max 5MB)</span>
              <input type="file" accept="image/*,.pdf" className="mt-1 block w-full text-sm" onChange={(e) => setFiles((f) => ({ ...f, certificate: e.target.files?.[0] || null }))} />
            </label>
          </div>
        );
        case 2: return renderShopServicesStep();
        case 3: return (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Secure bank details for payouts</p>
            <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => update('accountHolderName', e.target.value)} />
            <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => update('accountNumber', e.target.value)} />
            <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => update('ifscCode', e.target.value.toUpperCase())} />
            <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => update('bankName', e.target.value)} />
            <Input placeholder="UPI ID (optional)" value={form.upiId} onChange={(e) => update('upiId', e.target.value)} />
          </div>
        );
        case 4: return (
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
    } else {
      switch (step) {
        case 0: return (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Welcome back, <strong>{existingUser?.name}</strong>. Complete your KYC to become a provider.</p>
            <Input placeholder="Aadhaar Number (12 digits)" maxLength={12} value={form.aadhaarNumber} onChange={(e) => update('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))} />
            <label className="block">
              <span className="text-xs text-slate-500">Aadhaar Document (image/PDF, max 5MB)</span>
              <input type="file" accept="image/*,.pdf" className="mt-1 block w-full text-sm" onChange={(e) => setFiles((f) => ({ ...f, aadhaar: e.target.files?.[0] || null }))} />
            </label>
            <Input placeholder="PAN Number" maxLength={10} value={form.panNumber} onChange={(e) => update('panNumber', e.target.value.toUpperCase().slice(0, 10))} />
            <label className="block">
              <span className="text-xs text-slate-500">PAN Document (image/PDF, max 5MB)</span>
              <input type="file" accept="image/*,.pdf" className="mt-1 block w-full text-sm" onChange={(e) => setFiles((f) => ({ ...f, pan: e.target.files?.[0] || null }))} />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">Skill Certificate (image/PDF, max 5MB)</span>
              <input type="file" accept="image/*,.pdf" className="mt-1 block w-full text-sm" onChange={(e) => setFiles((f) => ({ ...f, certificate: e.target.files?.[0] || null }))} />
            </label>
          </div>
        );
        case 1: return renderShopServicesStep();
        case 2: return (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Secure bank details for payouts</p>
            <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => update('accountHolderName', e.target.value)} />
            <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => update('accountNumber', e.target.value)} />
            <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => update('ifscCode', e.target.value.toUpperCase())} />
            <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => update('bankName', e.target.value)} />
            <Input placeholder="UPI ID (optional)" value={form.upiId} onChange={(e) => update('upiId', e.target.value)} />
          </div>
        );
        case 3: return (
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
    }
  };

  const renderShopServicesStep = () => {
    if (categoriesLoading) {
      return <p className="text-sm text-slate-500">Loading services...</p>;
    }

    return (
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <p className="text-xs text-slate-500">Select all services you offer (you can select multiple across categories)</p>

        <div className="space-y-3">
          <Input placeholder="Experience (Years)" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} />
          <Input placeholder="Hourly Rate (₹)" value={form.hourlyRate} onChange={(e) => update('hourlyRate', e.target.value)} />
          <Input placeholder="Service Area / City" value={form.primaryServiceArea} onChange={(e) => update('primaryServiceArea', e.target.value)} />
          <Input type="number" placeholder="Max Travel Distance (km)" value={form.maxTravelDistanceKm} onChange={(e) => update('maxTravelDistanceKm', e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Profile Picture</span>
            <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={(e) => setForm((f) => ({ ...f, profilePicture: e.target.files?.[0] || null }))} />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-slate-600">Shop Photo</span>
            <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={(e) => setForm((f) => ({ ...f, shopPhoto: e.target.files?.[0] || null }))} />
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-600">Shop Location</p>
          <div className="flex gap-2">
            <Input placeholder="Latitude" value={form.shopLocation.lat || ''} onChange={(e) => update('shopLocation', { ...form.shopLocation, lat: +e.target.value || 0 })} />
            <Input placeholder="Longitude" value={form.shopLocation.lng || ''} onChange={(e) => update('shopLocation', { ...form.shopLocation, lng: +e.target.value || 0 })} />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={captureShopLocation} disabled={locating}>
            {locating ? 'Getting location...' : 'Capture Current Location'}
          </Button>
          <Input placeholder="Shop Address Line 1" value={form.shopAddress.line1} onChange={(e) => update('shopAddress', { ...form.shopAddress, line1: e.target.value })} />
          <div className="flex gap-2">
            <Input placeholder="City" value={form.shopAddress.city} onChange={(e) => update('shopAddress', { ...form.shopAddress, city: e.target.value })} />
            <Input placeholder="State" value={form.shopAddress.state} onChange={(e) => update('shopAddress', { ...form.shopAddress, state: e.target.value })} />
          </div>
          <Input placeholder="Pincode" value={form.shopAddress.pincode} onChange={(e) => update('shopAddress', { ...form.shopAddress, pincode: e.target.value })} />
        </div>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat._id} className="rounded-lg border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCategory(cat._id)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 text-left"
              >
                <span className="text-sm font-semibold text-brand-navy">{cat.name}</span>
                <span className="text-xs text-slate-500">{expandedCategories[cat._id] ? 'Hide' : 'Show'}</span>
              </button>
              {expandedCategories[cat._id] && (
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cat.services.map((svc) => (
                    <label
                      key={svc._id}
                      className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition ${
                        selectedServices[svc.slug] ? 'border-brand-orange bg-orange-50' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-brand-orange"
                        checked={!!selectedServices[svc.slug]}
                        onChange={() => toggleService(svc.slug)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{svc.name}</p>
                        <p className="text-xs text-slate-500">₹{svc.basePrice}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500">
          {Object.values(selectedServices).filter(Boolean).length} service(s) selected
        </p>
      </div>
    );
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
            <Button type="button" variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button type="button" className="flex-1" onClick={() => setStep((s) => s + 1)}>
              Next
            </Button>
          ) : (
            <Button type="button" className="flex-1" onClick={submit} disabled={loading}>
              {loading ? (uploadingDoc ? `Uploading ${uploadingDoc}...` : 'Submitting...') : 'Submit Application'}
            </Button>
          )}
        </div>
      </AuthCard>
    </PublicLayout>
  );
}
