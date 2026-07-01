'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
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
import { Calendar, MapPin, CreditCard, Users } from 'lucide-react';

const NearbyMap = dynamic(
  () => import('@/components/maps/NearbyMap').then((mod) => mod.NearbyMap),
  { ssr: false }
);

type NearbyProvider = {
  _id: string;
  fullName?: string;
  shopName?: string;
  distance?: number;
  rating?: number;
  experienceYears?: number;
  profilePicture?: string;
};

function BookForm() {
  const router = useRouter();
  const params = useSearchParams();
  const slug = params.get('service') || 'electrician';
  const service = getServiceBySlug(slug) || SERVICES[0];

  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Patna');
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [providers, setProviders] = useState<NearbyProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  const price = service.basePrice;

  const requestCoords = () => {
    if (!navigator.geolocation) {
      toast.error('Location not supported on this device');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => toast.error('Enable live location to find nearby providers within 20 km'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const loadProviders = useCallback(async (lat: number, lng: number) => {
    try {
      const { data } = await api.get('/providers/nearby', {
        params: { lat, lng, category: service.name },
      });
      setProviders(data.data || []);
      if (!data.data?.length) toast.error('No available providers within 20 km for this service');
    } catch {
      toast.error('Could not load nearby providers');
    }
  }, [service.name]);

  useEffect(() => {
    if (coords) loadProviders(coords.lat, coords.lng);
  }, [coords, slug, loadProviders]);

  const handleBook = async () => {
    if (!date || !address) {
      toast.error('Please select date and address');
      return;
    }
    if (!coords) {
      toast.error('Live location is required');
      return;
    }
    if (!selectedProvider) {
      toast.error('Select a nearby available provider');
      return;
    }

    setLoading(true);
    try {
      const scheduledAt = new Date(`${date}T${time}:00`);
      const { data } = await api.post('/bookings', {
        serviceId: slug,
        providerId: selectedProvider,
        scheduledAt,
        time,
        estimatedAmount: price,
        paymentMethod: 'payu',
        address: {
          line1: address,
          city,
          state: 'Bihar',
          pincode: '800001',
          lat: coords.lat,
          lng: coords.lng,
        },
      });

      const booking = data.data;
      if (data.requiresPayment && data.payu) {
        toast.loading('Redirecting to PayU...', { id: 'payu' });
        await payWithPayU({ payuPayload: data.payu });
        return;
      }

      toast.success(`Booking ${booking.bookingId} confirmed!`);
      router.push(`/dashboard/bookings/${booking._id}`);
    } catch (err: unknown) {
      const res = (err as { response?: { status?: number; data?: { message?: string } } })?.response;
      if (res?.status === 401) {
        toast.error('Please login to book');
        router.push(`/login?redirect=/dashboard/book?service=${slug}`);
      } else {
        toast.error(res?.data?.message || 'Booking failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const mapPoints = coords
    ? providers.slice(0, 20).map((p, i) => ({
      id: p._id,
      label: p.shopName || p.fullName || 'Provider',
      lat: coords!.lat + (i * 0.002),
      lng: coords!.lng + (i * 0.002),
      meta: `${p.distance || '?'} km · ★ ${p.rating || 0}`,
    }))
    : [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Book Service" description="Select provider, schedule, pay and confirm" />

      <Card className="flex items-center gap-4 p-4">
        <ServiceIcon name={service.icon} className={service.color} />
        <div>
          <p className="font-semibold text-brand-navy">{service.name}</p>
          <p className="text-lg font-bold text-brand-orange">{formatCurrency(price)}</p>
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-brand-orange" /> Live Location
        </h3>
        <p className="text-sm text-slate-500">
          {coords
            ? `Location captured (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
            : 'Fetching your live location...'}
        </p>
        <Button variant="outline" size="sm" onClick={requestCoords}>Refresh Location</Button>
      </Card>

      <Card className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-orange" /> Nearby Providers (20 km)
          </h3>
          <span className="text-xs text-slate-500">{providers.length} available</span>
        </div>
        {coords && mapPoints.length > 0 ? <NearbyMap points={mapPoints} center={[coords.lat, coords.lng]} /> : null}
        <div className="space-y-2">
          {providers.map((p) => (
            <label
              key={p._id}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 ${
                selectedProvider === p._id ? 'border-brand-orange bg-orange-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="provider"
                  checked={selectedProvider === p._id}
                  onChange={() => setSelectedProvider(p._id)}
                />
                <div>
                  <p className="font-medium">{p.shopName || p.fullName || 'Provider'}</p>
                  <p className="text-xs text-slate-500">
                    {p.distance} km · {p.experienceYears || 0} yrs · ★ {p.rating || 0}
                  </p>
                </div>
              </div>
            </label>
          ))}
          {!providers.length && coords ? (
            <p className="text-sm text-slate-500">No online verified providers within 20 km.</p>
          ) : null}
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <h3 className="font-semibold flex items-center gap-2"><Calendar className="h-5 w-5 text-brand-orange" /> Schedule</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-5 w-5 text-brand-orange" /> Service Address</h3>
        <Input placeholder="House no., street, landmark" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
      </Card>

      <Card className="space-y-3 p-5">
        <h3 className="font-semibold flex items-center gap-2"><CreditCard className="h-5 w-5 text-brand-orange" /> Payment</h3>
        <p className="text-sm text-slate-600">Pay securely via PayU (UPI, cards, netbanking)</p>
      </Card>

      <Button className="w-full" size="lg" onClick={handleBook} disabled={loading}>
        {loading ? 'Processing...' : `Pay ${formatCurrency(price)} & Book`}
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
