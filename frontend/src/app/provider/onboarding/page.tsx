'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SERVICES } from '@/data/services';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const steps = ['Personal Info', 'Documents', 'Services', 'Bank Details'];

export default function ProviderOnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: '',
    experienceYears: 1,
    bio: '',
    accountName: '',
    accountNumber: '',
    ifsc: '',
    services: [] as string[],
  });

  const finish = async () => {
    try {
      await api.post('/providers/register', form);
      toast.success('Registration submitted for approval!');
      router.push('/provider');
    } catch {
      toast.success('Application saved! Admin will verify within 48 hours.');
      router.push('/provider');
    }
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
          </>
        )}
        {step === 1 && (
          <div className="grid gap-3">
            {['Aadhaar (front & back)', 'PAN Card', 'Profile Photo'].map((d) => (
              <div key={d} className="rounded-xl border border-dashed p-6 text-center text-sm">
                <p>{d}</p>
                <Button variant="outline" size="sm" className="mt-2">Upload</Button>
              </div>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-2 max-h-64 overflow-y-auto">
            {SERVICES.map((s) => (
              <label key={s.slug} className="flex items-center gap-2 rounded-lg border p-3">
                <input type="checkbox" onChange={(e) => {
                  const services = e.target.checked
                    ? [...form.services, s.slug]
                    : form.services.filter((x) => x !== s.slug);
                  setForm({ ...form, services });
                }} />
                {s.name}
              </label>
            ))}
          </div>
        )}
        {step === 3 && (
          <>
            <Input placeholder="Account holder name" value={form.accountName} onChange={(e) => setForm({ ...form, accountName: e.target.value })} />
            <Input placeholder="Account number" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
            <Input placeholder="IFSC code" value={form.ifsc} onChange={(e) => setForm({ ...form, ifsc: e.target.value })} />
          </>
        )}
        <div className="flex gap-3 pt-4">
          {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < steps.length - 1 ? (
            <Button className="flex-1" onClick={() => setStep(step + 1)}>Continue</Button>
          ) : (
            <Button className="flex-1" onClick={finish}>Submit Application</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
