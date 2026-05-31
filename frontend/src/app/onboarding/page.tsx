'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SERVICES } from '@/data/services';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Upload, CheckCircle, ArrowRight, ArrowLeft, Star, Navigation } from 'lucide-react';

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const LeafletCircle = dynamic(() => import('react-leaflet').then((m) => m.Circle), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });

import 'leaflet/dist/leaflet.css';

let L: typeof import('leaflet') | null = null;
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  L = require('leaflet');
  const DefaultIcon = L!.Icon.Default;
  if (DefaultIcon && DefaultIcon.prototype) {
    DefaultIcon.prototype.options.iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
    DefaultIcon.prototype.options.iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
    DefaultIcon.prototype.options.shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
  }
}

const steps = ['Welcome', 'Service', 'Location', 'Documents', 'Bank', 'Review'];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [serviceRadius, setServiceRadius] = useState(5);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    services: [] as string[],
    bio: '',
    aadhaarNumber: '',
    panNumber: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: '',
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    aadhaar: null,
    pan: null,
    certificate: null,
  });

  const captureLocation = useCallback(() => {
    setLocLoading(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        toast.success('Live location captured!');
        setLocLoading(false);
      },
      () => {
        toast.error('Could not get location. Using default.');
        setPosition([25.5941, 85.1376]);
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  useEffect(() => {
    if (step === 2 && !position) {
      captureLocation();
    }
  }, [step, position, captureLocation]);

  const next = () => step < steps.length - 1 && setStep((s) => s + 1);
  const prev = () => step > 0 && setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Register user
      const registerRes = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone.replace(/\D/g, ''),
        password: form.password,
        role: 'provider',
      });
      localStorage.setItem('token', registerRes.data.token);

      // 2. Create provider profile
      await api.post('/providers/profile', {
        bio: form.bio,
        aadhaarNumber: form.aadhaarNumber,
        panNumber: form.panNumber,
        skills: form.services.map((s) => ({ name: s, experienceYears: 0, hourlyRate: 0 })),
        bankDetails: {
          accountHolderName: form.accountHolderName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
          bankName: form.bankName,
          upiId: form.upiId,
        },
        address: position
          ? { line1: '', city: 'Patna', state: 'Bihar', lat: position[0], lng: position[1] }
          : undefined,
        maxTravelDistanceKm: serviceRadius,
        isAvailable: true,
      });

      // 3. Upload documents
      const docTypes = ['aadhaar', 'pan', 'certificate'] as const;
      for (const docType of docTypes) {
        const file = files[docType];
        if (file) {
          const fd = new FormData();
          fd.append('document', file);
          fd.append('docType', docType);
          try {
            await api.post('/providers/document', fd, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          } catch {
            toast.error(`${docType} upload failed — upload later from profile.`);
          }
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

  const update = (key: string, val: string | string[] | number) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const toggleService = (slug: string) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(slug)
        ? f.services.filter((s) => s !== slug)
        : [...f.services, slug],
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10">
              <Star className="h-10 w-10 text-brand-orange" />
            </div>
            <h2 className="text-2xl font-bold text-brand-navy">Become a ServDeal Partner</h2>
            <p className="text-slate-600">Complete this quick onboarding to start accepting bookings in your area.</p>
            <div className="grid gap-3 text-left">
              <Input placeholder="Full Name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
              <Input type="email" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
              <Input type="tel" placeholder="Phone (10 digits)" maxLength={10} value={form.phone} onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} required />
              <Input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={(e) => update('password', e.target.value)} required />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Select your services</h3>
            <div className="grid gap-2 max-h-80 overflow-y-auto pr-1">
              {SERVICES.map((s) => (
                <label
                  key={s.slug}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                    form.services.includes(s.slug) ? 'border-brand-orange bg-orange-50' : 'border-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.services.includes(s.slug)}
                    onChange={() => toggleService(s.slug)}
                    className="h-5 w-5 accent-brand-orange"
                  />
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-slate-500">Starting from {s.basePrice ? `₹${s.basePrice}` : 'Custom'}</p>
                  </div>
                </label>
              ))}
            </div>
            <textarea
              className="w-full rounded-xl border p-3 text-sm"
              rows={3}
              placeholder="Short bio about your experience..."
              value={form.bio}
              onChange={(e) => update('bio', e.target.value)}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Your Service Area</h3>
              <Button variant="outline" size="sm" onClick={captureLocation} disabled={locLoading}>
                <Navigation className="mr-1 h-4 w-4" />
                {locLoading ? 'Locating...' : 'Refresh Location'}
              </Button>
            </div>
            {position && (
              <div className="rounded-xl overflow-hidden border">
                <MapContainer center={position} zoom={13} className="h-72 w-full">
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position}>
                    <Popup>Your location</Popup>
                  </Marker>
                  <LeafletCircle
                    center={position}
                    radius={serviceRadius * 1000}
                    pathOptions={{ fillColor: '#f97316', fillOpacity: 0.15, color: '#f97316', weight: 2 }}
                  />
                </MapContainer>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Service Radius: {serviceRadius} km</label>
              <input
                type="range"
                min={1}
                max={50}
                value={serviceRadius}
                onChange={(e) => setServiceRadius(Number(e.target.value))}
                className="mt-1 w-full accent-brand-orange"
              />
            </div>
            {!position && <p className="text-sm text-slate-500">Capturing your location...</p>}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">KYC Documents</h3>
            <Input placeholder="Aadhaar Number (12 digits)" maxLength={12} value={form.aadhaarNumber} onChange={(e) => update('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))} />
            <label className="block rounded-xl border border-dashed p-4 text-center">
              <Upload className="mx-auto h-6 w-6 text-slate-400" />
              <p className="mt-2 text-sm font-medium">Aadhaar Document</p>
              <input
                type="file"
                accept="image/*,.pdf"
                className="mt-2 mx-auto block text-sm"
                onChange={(e) => setFiles((f) => ({ ...f, aadhaar: e.target.files?.[0] || null }))}
              />
            </label>
            <Input placeholder="PAN Number" maxLength={10} value={form.panNumber} onChange={(e) => update('panNumber', e.target.value.toUpperCase().slice(0, 10))} />
            <label className="block rounded-xl border border-dashed p-4 text-center">
              <Upload className="mx-auto h-6 w-6 text-slate-400" />
              <p className="mt-2 text-sm font-medium">PAN Document</p>
              <input
                type="file"
                accept="image/*,.pdf"
                className="mt-2 mx-auto block text-sm"
                onChange={(e) => setFiles((f) => ({ ...f, pan: e.target.files?.[0] || null }))}
              />
            </label>
            <label className="block rounded-xl border border-dashed p-4 text-center">
              <Upload className="mx-auto h-6 w-6 text-slate-400" />
              <p className="mt-2 text-sm font-medium">Skill Certificate</p>
              <input
                type="file"
                accept="image/*,.pdf"
                className="mt-2 mx-auto block text-sm"
                onChange={(e) => setFiles((f) => ({ ...f, certificate: e.target.files?.[0] || null }))}
              />
            </label>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Bank Details for Payouts</h3>
            <Input placeholder="Account Holder Name" value={form.accountHolderName} onChange={(e) => update('accountHolderName', e.target.value)} />
            <Input placeholder="Account Number" value={form.accountNumber} onChange={(e) => update('accountNumber', e.target.value)} />
            <Input placeholder="IFSC Code" value={form.ifscCode} onChange={(e) => update('ifscCode', e.target.value.toUpperCase())} />
            <Input placeholder="Bank Name" value={form.bankName} onChange={(e) => update('bankName', e.target.value)} />
            <Input placeholder="UPI ID (optional)" value={form.upiId} onChange={(e) => update('upiId', e.target.value)} />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Review & Submit</h3>
            <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
              <div className="flex justify-between"><span>Name</span><span className="font-medium">{form.name}</span></div>
              <div className="flex justify-between"><span>Email</span><span className="font-medium">{form.email}</span></div>
              <div className="flex justify-between"><span>Phone</span><span className="font-medium">{form.phone}</span></div>
              <div className="flex justify-between"><span>Services</span><span className="font-medium">{form.services.length} selected</span></div>
              <div className="flex justify-between"><span>Service Radius</span><span className="font-medium">{serviceRadius} km</span></div>
              <div className="flex justify-between"><span>Location</span><span className="font-medium">{position ? `${position[0].toFixed(3)}, ${position[1].toFixed(3)}` : 'Not captured'}</span></div>
              <div className="flex justify-between"><span>KYC</span><span className="font-medium">{form.aadhaarNumber ? 'Submitted' : 'Pending'}</span></div>
              <div className="flex justify-between"><span>Bank</span><span className="font-medium">{form.accountNumber ? 'Submitted' : 'Pending'}</span></div>
            </div>
            <p className="text-xs text-slate-500">Your profile will be reviewed by admin before going live. This usually takes 24-48 hours.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-xl py-8 px-4">
        <h1 className="text-2xl font-bold text-brand-navy text-center">Partner Onboarding</h1>

        {/* Step Indicator */}
        <div className="mt-6 flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                  i <= step ? 'bg-brand-orange text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-[10px] ${i <= step ? 'text-brand-orange font-medium' : 'text-slate-400'}`}>{s}</span>
            </div>
          ))}
        </div>

        <Card className="mt-6 p-6">
          {renderStep()}

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={prev} className="flex-1">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            )}
            {step < steps.length - 1 ? (
              <Button onClick={next} className="flex-1">
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </PublicLayout>
  );
}
