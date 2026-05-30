'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getServiceBySlug, SERVICES } from '@/data/services';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import { formatCurrency } from '@/lib/utils';
import { payWithPayU } from '@/lib/payu';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Calendar, MapPin, CreditCard, Wallet, Banknote } from 'lucide-react';

const paymentMethods = [
  { id: 'payu', label: 'Card / UPI (PayU)', icon: CreditCard },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
];

function BookForm() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get('service') || 'electrician';
  const pkg = params.get('package') || 'basic';
  const service = getServiceBySlug(slug) || SERVICES[0];

  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Patna');
  const [payment, setPayment] = useState('payu');
  const [loading, setLoading] = useState(false);

  const price =
    pkg === 'premium'
      ? Math.round(service.basePrice * 2)
      : pkg === 'standard'
        ? Math.round(service.basePrice * 1.4)
        : service.basePrice;

  const handleBook = async () => {
    if (!date || !address) {
      toast.error('Please select date and address');
      return;
    }
    setLoading(true);
    try {
      const scheduledAt = new Date(`${date}T${time}:00`);
      const { data } = await api.post('/bookings', {
        serviceId: slug,
        packageName: pkg,
        scheduledAt,
        amount: price,
        paymentMethod: payment === 'payu' ? 'payu' : payment,
        address: { line1: address, city, state: 'Bihar', pincode: '800001' },
      });

      const booking = data.data;

      if (data.requiresPayment && payment === 'payu') {
        toast.loading('Redirecting to PayU...', { id: 'payu' });
        try {
          await payWithPayU({
            bookingId: booking._id,
            description: `${service.name} - ${pkg}`,
          });
        } catch (payErr: unknown) {
          toast.dismiss('payu');
          const msg = payErr instanceof Error ? payErr.message : 'Payment failed';
          if (msg.includes('cancelled')) {
            toast.error('Payment cancelled. Booking saved — pay from My Bookings.');
            router.push(`/dashboard/bookings/${booking._id}`);
          } else {
            toast.error(msg);
            router.push(`/dashboard/bookings/${booking._id}`);
          }
        }
        return;
      }

      toast.success(`Booking ${booking.bookingId} confirmed!`);
      router.push(`/dashboard/bookings/${booking._id}`);
    } catch (err: unknown) {
      const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
      const msg = res?.data?.message;
      if (res?.status === 401) {
        toast.error('Please login to book');
        router.push(`/login?redirect=/dashboard/book?service=${slug}`);
      } else {
        toast.error(msg || 'Booking failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Book Service" description="Complete your booking in a few steps" />

      <Card className="flex items-center gap-4 p-4">
        <ServiceIcon name={service.icon} className={service.color} />
        <div>
          <p className="font-semibold text-brand-navy">{service.name}</p>
          <p className="text-sm capitalize text-slate-500">{pkg} package</p>
          <p className="text-lg font-bold text-brand-orange">{formatCurrency(price)}</p>
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <h3 className="font-semibold flex items-center gap-2"><Calendar className="h-5 w-5 text-brand-orange" /> Schedule</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
          </div>
          <div>
            <label className="text-sm font-medium">Time</label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-5 w-5 text-brand-orange" /> Address</h3>
        <Input placeholder="House no., street, landmark" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      </Card>

      <Card className="space-y-3 p-5">
        <h3 className="font-semibold">Payment Method</h3>
        {paymentMethods.map((m) => (
          <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${payment === m.id ? 'border-brand-orange bg-orange-50' : ''}`}>
            <input type="radio" name="pay" checked={payment === m.id} onChange={() => setPayment(m.id)} />
            <m.icon className="h-5 w-5 text-brand-orange" />
            <span className="text-sm font-medium">{m.label}</span>
          </label>
        ))}
        {payment === 'payu' && (
          <p className="text-xs text-slate-500">Secured by PayU — UPI, cards, netbanking supported.</p>
        )}
      </Card>

      <Button className="w-full" size="lg" onClick={handleBook} disabled={loading}>
        {loading ? 'Processing...' : payment === 'payu' ? `Pay ${formatCurrency(price)} & Book` : `Confirm Booking · ${formatCurrency(price)}`}
      </Button>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <BookForm />
    </Suspense>
  );
}
