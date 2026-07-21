'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SERVICE_CATEGORIES } from '@/data/services';
import api from '@/lib/api';

const REGISTRATION_STEPS = [
  'Personal Details',
  'Shop & Location',
  'Services & Skills',
  'KYC Documents',
  'Bank Details',
];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const [form, setForm] = useState({
    // Personal Details
    name: '',
    phone: '',
    email: '',
    password: '',
    
    // Shop Details
    shopName: '',
    shopAddress: '',
    city: '',
    state: '',
    pincode: '',
    shopLocation: { lat: 0, lng: 0 },
    
    // Services
    selectedServices: [] as string[],
    experienceYears: '',
    skills: '',
    
    // KYC
    aadhaarNumber: '',
    panNumber: '',
    
    // Bank
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: '',
    
    // Documents
    aadhaarFile: null as File | null,
    panFile: null as File | null,
    certificateFile: null as File | null,
    shopPhoto: null as File | null,
    profilePhoto: null as File | null,
  });

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const update = (key: string, val: string | number | boolean | object) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const toggleService = (serviceSlug: string) => {
    setForm((f) => ({
      ...f,
      selectedServices: f.selectedServices.includes(serviceSlug)
        ? f.selectedServices.filter((s) => s !== serviceSlug)
        : [...f.selectedServices, serviceSlug],
    }));
  };

  const captureLocation = useCallback(() => {
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
        toast.success('Location captured successfully');
        setLocating(false);
      },
      () => {
        toast.error('Unable to get location');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  const uploadFile = async (file: File, type: string) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    const res = await api.post('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url;
  };

  const submit = async () => {
    setLoading(true);
    try {
      // Validation
      if (form.selectedServices.length === 0) {
        toast.error('Please select at least one service');
        setLoading(false);
        return;
      }

      // Register user
      const registerRes = await api.post('/auth/register', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        role: 'provider',
      });
      const token = registerRes.data.token;
      localStorage.setItem('token', token);

      // Upload documents
      let aadhaarUrl = '', panUrl = '', certificateUrl = '', shopPhotoUrl = '', profilePhotoUrl = '';
      
      if (form.aadhaarFile) aadhaarUrl = await uploadFile(form.aadhaarFile, 'aadhaar');
      if (form.panFile) panUrl = await uploadFile(form.panFile, 'pan');
      if (form.certificateFile) certificateUrl = await uploadFile(form.certificateFile, 'certificate');
      if (form.shopPhoto) shopPhotoUrl = await uploadFile(form.shopPhoto, 'shopPhoto');
      if (form.profilePhoto) profilePhotoUrl = await uploadFile(form.profilePhoto, 'profilePhoto');

      // Create provider profile
      await api.post('/providers/profile', {
        shopName: form.shopName,
        shopAddress: form.shopAddress,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        location: form.shopLocation,
        services: form.selectedServices,
        experienceYears: parseInt(form.experienceYears) || 0,
        skills: form.skills,
        aadhaarNumber: form.aadhaarNumber,
        panNumber: form.panNumber,
        bankDetails: {
          accountHolderName: form.accountHolderName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
          bankName: form.bankName,
          upiId: form.upiId,
        },
        documents: {
          aadhaar: aadhaarUrl,
          pan: panUrl,
          certificate: certificateUrl,
        },
        shopPhoto: shopPhotoUrl,
        profilePhoto: profilePhotoUrl,
        maxServiceRadius: 20, // 20km radius
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Registration successful! Your profile is under review.');
      router.push('/provider/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-brand-navy">Personal Details</h3>
              <p className="text-sm text-slate-500">Tell us about yourself</p>
            </div>
            <Input placeholder="Full Name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
            <Input type="tel" placeholder="Phone Number (10 digits)" maxLength={10} value={form.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
            <Input type="email" placeholder="Email Address" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            <Input type="password" placeholder="Create Password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-brand-navy">Shop & Location</h3>
              <p className="text-sm text-slate-500">Where do you operate?</p>
            </div>
            <Input placeholder="Shop/Business Name" value={form.shopName} onChange={(e) => update('shopName', e.target.value)} required />
            <Input placeholder="Shop Address" value={form.shopAddress} onChange={(e) => update('shopAddress', e.target.value)} required />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} required />
              <Input placeholder="State" value={form.state} onChange={(e) => update('state', e.target.value)} required />
            </div>
            <Input placeholder="Pincode" value={form.pincode} onChange={(e) => update('pincode', e.target.value)} required />
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Shop Location (GPS)</p>
              <div className="flex gap-2">
                <Input placeholder="Latitude" value={form.shopLocation.lat || ''} onChange={(e) => update('shopLocation', { ...form.shopLocation, lat: parseFloat(e.target.value) || 0 })} />
                <Input placeholder="Longitude" value={form.shopLocation.lng || ''} onChange={(e) => update('shopLocation', { ...form.shopLocation, lng: parseFloat(e.target.value) || 0 })} />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={captureLocation} disabled={locating} className="w-full">
                {locating ? '📍 Getting Location...' : '📍 Capture Current Location'}
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Shop Photo</p>
              <input type="file" accept="image/*" className="w-full text-sm" onChange={(e) => update('shopPhoto', e.target.files?.[0] || null)} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-brand-navy">Services & Skills</h3>
              <p className="text-sm text-slate-500">Select services you offer (70+ categories)</p>
            </div>
            <Input placeholder="Years of Experience" type="number" value={form.experienceYears} onChange={(e) => update('experienceYears', e.target.value)} required />
            <textarea 
              className="w-full rounded-lg border border-slate-200 p-3 text-sm" 
              rows={3} 
              placeholder="Describe your skills and expertise..." 
              value={form.skills} 
              onChange={(e) => update('skills', e.target.value)} 
            />
            <div className="space-y-3">
              {SERVICE_CATEGORIES.map((category) => (
                <div key={category.slug} className="rounded-lg border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.slug)}
                    className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 text-left"
                  >
                    <span className="text-sm font-semibold text-brand-navy">{category.title}</span>
                    <span className="text-xs text-slate-500">{expandedCategories[category.slug] ? '▼' : '▶'}</span>
                  </button>
                  {expandedCategories[category.slug] && (
                    <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {category.services.map((service) => (
                        <label
                          key={service.slug}
                          className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition ${
                            form.selectedServices.includes(service.slug) 
                              ? 'border-brand-orange bg-orange-50' 
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-brand-orange"
                            checked={form.selectedServices.includes(service.slug)}
                            onChange={() => toggleService(service.slug)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{service.name}</p>
                            <p className="text-xs text-slate-500">₹{service.basePrice}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 font-medium">
              {form.selectedServices.length} service(s) selected
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-brand-navy">KYC Documents</h3>
              <p className="text-sm text-slate-500">Upload your documents for verification</p>
            </div>
            <Input placeholder="Aadhaar Number (12 digits)" maxLength={12} value={form.aadhaarNumber} onChange={(e) => update('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))} required />
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Aadhaar Card (Front)</p>
              <input type="file" accept="image/*,.pdf" className="w-full text-sm" onChange={(e) => update('aadhaarFile', e.target.files?.[0] || null)} />
            </div>
            <Input placeholder="PAN Number (10 characters)" maxLength={10} value={form.panNumber} onChange={(e) => update('panNumber', e.target.value.toUpperCase().slice(0, 10))} required />
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">PAN Card</p>
              <input type="file" accept="image/*,.pdf" className="w-full text-sm" onChange={(e) => update('panFile', e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Skill Certificate (Optional)</p>
              <input type="file" accept="image/*,.pdf" className="w-full text-sm" onChange={(e) => update('certificateFile', e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Profile Photo</p>
              <input type="file" accept="image/*" className="w-full text-sm" onChange={(e) => update('profilePhoto', e.target.files?.[0] || null)} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-brand-navy">Bank Details</h3>
              <p className="text-sm text-slate-500">For secure payouts</p>
            </div>
            <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => update('accountHolderName', e.target.value)} required />
            <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => update('accountNumber', e.target.value)} required />
            <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => update('ifscCode', e.target.value.toUpperCase())} required />
            <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => update('bankName', e.target.value)} required />
            <Input placeholder="UPI ID (Optional)" value={form.upiId} onChange={(e) => update('upiId', e.target.value)} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PublicLayout>
      <AuthCard
        title="Partner Registration"
        subtitle={`Step ${step + 1} of ${REGISTRATION_STEPS.length}: ${REGISTRATION_STEPS[step]}`}
        footer={
          <p className="text-slate-600">
            Already a partner?{' '}
            <Link href="/login?role=provider" className="font-semibold text-brand-orange hover:underline">
              Login here
            </Link>
          </p>
        }
      >
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex gap-1">
            {REGISTRATION_STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-brand-orange' : 'bg-slate-200'}`} />
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            {Math.round(((step + 1) / REGISTRATION_STEPS.length) * 100)}% Complete
          </p>
        </div>

        {renderStep()}

        {/* Navigation Buttons */}
        <div className="mt-6 flex gap-3">
          {step > 0 && (
            <Button type="button" variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
              ← Back
            </Button>
          )}
          {step < REGISTRATION_STEPS.length - 1 ? (
            <Button type="button" className="flex-1" onClick={() => setStep((s) => s + 1)}>
              Next →
            </Button>
          ) : (
            <Button type="button" className="flex-1" onClick={submit} disabled={loading}>
              {loading ? 'Submitting...' : '✓ Submit Application'}
            </Button>
          )}
        </div>
      </AuthCard>
    </PublicLayout>
  );
}
