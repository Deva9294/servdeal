'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Upload, X, FileImage, FileText } from 'lucide-react';

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

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];

const steps = ['Personal Info', 'Documents', 'Services', 'Bank Details'];

export default function ProviderOnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [form, setForm] = useState({
    businessName: '',
    experienceYears: 1,
    bio: '',
    accountName: '',
    accountNumber: '',
    ifsc: '',
    services: [] as string[],
    location: { lat: 0, lng: 0 } as { lat: number; lng: number },
    shopAddress: '',
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    aadhaar: null,
    pan: null,
    profilePhoto: null,
  });

  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [locLoading, setLocLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all categories and services from backend
  useEffect(() => {
    api.get('/services/by-category')
      .then(({ data }) => {
        setCategories(data.data || []);
      })
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setCategoriesLoading(false));
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, WEBP, or PDF files are allowed';
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File size must be less than ${MAX_FILE_SIZE_MB}MB`;
    }
    return null;
  };

  const handleFileChange = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      toast.error(err);
      e.target.value = '';
      return;
    }
    setFiles((prev) => ({ ...prev, [docType]: file }));
    toast.success(`${docType === 'profilePhoto' ? 'Profile Photo' : docType === 'aadhaar' ? 'Aadhaar' : 'PAN'} selected: ${file.name}`);
  };

  const removeFile = (docType: string) => {
    setFiles((prev) => ({ ...prev, [docType]: null }));
  };

  const captureLocation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, location: { lat: pos.coords.latitude, lng: pos.coords.longitude } }));
        toast.success('Live location captured');
        setLocLoading(false);
      },
      () => {
        toast.error('Could not get location');
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const uploadDocument = async (file: File, docType: string) => {
    const fd = new FormData();
    if (docType === 'profilePhoto') {
      fd.append('image', file);
      fd.append('type', 'profilePicture');
      const res = await api.post('/providers/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.url;
    }
    fd.append('document', file);
    fd.append('docType', docType);
    const res = await api.post('/providers/document', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url || res.data.documentUrl;
  };

  const finish = async () => {
    setSubmitting(true);
    try {
      // Upload documents first
      let aadhaarUrl = '';
      let panUrl = '';
      let profilePhotoUrl = '';

      if (files.aadhaar) {
        setUploadingDoc('aadhaar');
        try {
          aadhaarUrl = await uploadDocument(files.aadhaar, 'aadhaar');
        } catch {
          toast.error('Aadhaar upload failed');
        }
      }
      if (files.pan) {
        setUploadingDoc('pan');
        try {
          panUrl = await uploadDocument(files.pan, 'pan');
        } catch {
          toast.error('PAN upload failed');
        }
      }
      if (files.profilePhoto) {
        setUploadingDoc('profilePhoto');
        try {
          profilePhotoUrl = await uploadDocument(files.profilePhoto, 'profilePhoto');
        } catch {
          toast.error('Profile photo upload failed');
        }
      }
      setUploadingDoc(null);

      const payload = {
        ...form,
        bankDetails: {
          accountName: form.accountName,
          accountNumber: form.accountNumber,
          ifsc: form.ifsc,
        },
        location: form.location.lat !== 0 ? form.location : undefined,
        aadhaarUrl,
        panUrl,
        profilePhotoUrl,
        requestVerification: true,
      };

      await api.post('/providers/register', payload);
      toast.success('Registration submitted for approval!');
      router.push('/provider/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadingDoc(null);
    }
  };

  const toggleService = (slug: string) => {
    setForm((f) => {
      const exists = f.services.includes(slug);
      return {
        ...f,
        services: exists ? f.services.filter((s) => s !== slug) : [...f.services, slug],
      };
    });
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return <FileText className="h-5 w-5 text-red-500" />;
    return <FileImage className="h-5 w-5 text-brand-orange" />;
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <h1 className="text-2xl font-bold text-brand-navy">Provider Registration</h1>
      <div className="mt-4 flex gap-2">
        {steps.map((s, i) => (
          <div key={s} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-brand-orange' : 'bg-slate-200'}`} />
        ))}
      </div>
      <Card className="mt-6 space-y-4 p-6">
        {step === 0 && (
          <>
            <Input placeholder="Business / Display Name" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
            <Input type="number" placeholder="Years of experience" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })} />
            <textarea className="w-full rounded-xl border p-3 text-sm" placeholder="Short bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            <Input placeholder="Shop Address" value={form.shopAddress} onChange={(e) => setForm({ ...form, shopAddress: e.target.value })} />
            <div className="rounded-xl border p-4">
              <p className="text-sm font-medium text-slate-700">Live Location</p>
              <p className="text-xs text-slate-500">Required for service area mapping</p>
              {form.location.lat !== 0 && (
                <p className="text-xs text-green-600 mt-1">✓ Captured: {form.location.lat.toFixed(5)}, {form.location.lng.toFixed(5)}</p>
              )}
              <Button variant="outline" size="sm" className="mt-2" onClick={captureLocation} disabled={locLoading}>
                {locLoading ? 'Capturing...' : 'Capture My Live Location'}
              </Button>
            </div>
          </>
        )}

        {step === 1 && (
          <div className="grid gap-4">
            <p className="text-xs text-slate-500">
              Accepted: JPG, PNG, WEBP, PDF. Max {MAX_FILE_SIZE_MB}MB each.
            </p>

            {/* Aadhaar */}
            <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center">
              <p className="text-sm font-medium text-slate-700">Aadhaar (front & back)</p>
              {!files.aadhaar ? (
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition">
                  <Upload className="h-4 w-4" />
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={(e) => handleFileChange('aadhaar', e)}
                  />
                </label>
              ) : (
                <div className="mt-3 flex items-center justify-center gap-2">
                  {getFileIcon(files.aadhaar.type)}
                  <span className="text-sm text-slate-700 truncate max-w-[180px]">{files.aadhaar.name}</span>
                  <button type="button" onClick={() => removeFile('aadhaar')} className="text-red-500 hover:text-red-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* PAN Card */}
            <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center">
              <p className="text-sm font-medium text-slate-700">PAN Card</p>
              {!files.pan ? (
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition">
                  <Upload className="h-4 w-4" />
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={(e) => handleFileChange('pan', e)}
                  />
                </label>
              ) : (
                <div className="mt-3 flex items-center justify-center gap-2">
                  {getFileIcon(files.pan.type)}
                  <span className="text-sm text-slate-700 truncate max-w-[180px]">{files.pan.name}</span>
                  <button type="button" onClick={() => removeFile('pan')} className="text-red-500 hover:text-red-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Profile Photo */}
            <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center">
              <p className="text-sm font-medium text-slate-700">Profile Photo</p>
              <p className="text-xs text-slate-500 mt-1">Clear face photo for verification</p>
              {!files.profilePhoto ? (
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition">
                  <Upload className="h-4 w-4" />
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => handleFileChange('profilePhoto', e)}
                  />
                </label>
              ) : (
                <div className="mt-3 flex flex-col items-center gap-2">
                  <img
                    src={URL.createObjectURL(files.profilePhoto)}
                    alt="Preview"
                    className="h-20 w-20 rounded-full object-cover border"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-700 truncate max-w-[180px]">{files.profilePhoto.name}</span>
                    <button type="button" onClick={() => removeFile('profilePhoto')} className="text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {categoriesLoading ? (
              <p className="text-sm text-slate-500">Loading services...</p>
            ) : (
              <>
                <p className="text-xs text-slate-500">Select all services you offer</p>
                <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <div key={cat._id}>
                      <p className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">{cat.name}</p>
                      <div className="grid gap-1 mt-1">
                        {cat.services.map((s) => (
                          <label
                            key={s._id}
                            className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition ${
                              form.services.includes(s.slug) ? 'border-brand-orange bg-orange-50' : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-brand-orange"
                              checked={form.services.includes(s.slug)}
                              onChange={() => toggleService(s.slug)}
                            />
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <ServiceIcon name={s.icon} className={s.color || 'bg-orange-100 text-brand-orange'} />
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{s.name}</p>
                                <p className="text-xs text-slate-500">₹{s.basePrice}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500">{form.services.length} service(s) selected</p>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <>
            <p className="text-xs text-slate-500">Secure bank details for payouts</p>
            <Input placeholder="Account holder name" value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} />
            <Input placeholder="Account number" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
            <Input placeholder="IFSC code" value={form.ifsc} onChange={(e) => setForm({ ...form, ifsc: e.target.value })} />
          </>
        )}

        <div className="flex gap-3 pt-4">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={submitting}>
              Back
            </Button>
          )}
          {step < steps.length - 1 ? (
            <Button className="flex-1" onClick={() => setStep(step + 1)}>
              Continue
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={finish}
              disabled={submitting}
            >
              {submitting
                ? uploadingDoc
                  ? `Uploading ${uploadingDoc}...`
                  : 'Submitting...'
                : 'Submit Application'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
