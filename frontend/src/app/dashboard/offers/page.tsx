'use client';

import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Tag } from 'lucide-react';

export default function OffersPage() {
  const { data: coupons } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      try {
        const res = await api.get('/coupons');
        return res.data.data;
      } catch {
        return [
          { code: 'WELCOME100', title: 'Welcome Offer', description: 'Flat ₹100 off', discountValue: 100 },
          { code: 'AC100', title: 'AC Service', description: '₹100 off AC repair', discountValue: 100 },
        ];
      }
    },
  });

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied ${code}`);
  };

  return (
    <div>
      <PageHeader title="Offers & Coupons" description="Apply codes at checkout" />
      <div className="grid gap-4 md:grid-cols-2">
        {(coupons || []).map((c: { code: string; title: string; description: string; discountValue: number }) => (
          <Card key={c.code} className="border-2 border-dashed border-brand-orange p-6">
            <Tag className="h-8 w-8 text-brand-orange" />
            <p className="mt-3 font-bold text-brand-navy">{c.title}</p>
            <p className="text-sm text-slate-500">{c.description}</p>
            <p className="mt-2 text-2xl font-bold text-brand-orange">₹{c.discountValue} OFF</p>
            <p className="mt-1 font-mono text-sm">Code: {c.code}</p>
            <Button className="mt-4" variant="secondary" size="sm" onClick={() => copy(c.code)}>Copy Code</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
