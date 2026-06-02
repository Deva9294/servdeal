'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ServiceIcon } from '@/components/services/ServiceIcon';
import api from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';

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

interface ProviderProfile {
  services: ServiceItem[];
  serviceRadiusKm?: number;
  currentLocation?: { coordinates: [number, number] };
  city?: string;
}

export default function ProviderServicesPage() {
  const qc = useQueryClient();
  const [radius, setRadius] = useState('10');
  const [locLoading, setLocLoading] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  const { data: categoriesData, isLoading: loadingCats } = useQuery({
    queryKey: ['services-by-category'],
    queryFn: async () => {
      const res = await api.get('/services/by-category');
      return (res.data.data || []) as ServiceCategory[];
    },
  });

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ['provider-profile'],
    queryFn: async () => {
      const res = await api.get('/providers/me');
      return res.data.data as ProviderProfile;
    },
  });

  const myServiceIds = new Set((profile?.services || []).map((s) => s._id));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(myServiceIds);

  // Keep selectedIds in sync when profile loads
  if (loadingProfile === false && myServiceIds.size !== selectedIds.size && selectedIds.size === 0) {
    setSelectedIds(myServiceIds);
  }

  const saveMutation = useMutation({
    mutationFn: async (data: { services: string[]; serviceRadiusKm?: number; location?: { lat: number; lng: number } }) => {
      const res = await api.patch('/providers/me', data);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Services saved successfully');
      qc.invalidateQueries({ queryKey: ['provider-profile'] });
      qc.invalidateQueries({ queryKey: ['provider-bookings'] });
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Failed to save services');
    },
  });

  const toggleService = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCategory = (catId: string) => {
    setExpandedCats((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleSave = () => {
    const allServices = (categoriesData || []).flatMap((cat) => cat.services);
    const slugs: string[] = [];
    for (const svc of allServices) {
      if (selectedIds.has(svc._id)) slugs.push(svc.slug);
    }
    saveMutation.mutate({
      services: slugs,
      serviceRadiusKm: Number(radius) || 10,
    });
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
        const allServices = (categoriesData || []).flatMap((cat) => cat.services);
        saveMutation.mutate({
          services: Array.from(selectedIds).map((id) => allServices.find((s) => s._id === id)?.slug).filter(Boolean) as string[],
          serviceRadiusKm: Number(radius) || 10,
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        });
        setLocLoading(false);
      },
      () => {
        toast.error('Could not get location');
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const isLoading = loadingCats || loadingProfile;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-navy">My Services</h1>
        <Button onClick={handleSave} disabled={saveMutation.isPending || isLoading}>
          {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Loading services...</p>}

      <div className="space-y-4">
        {(categoriesData || []).map((cat) => (
          <div key={cat._id} className="rounded-xl border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleCategory(cat._id)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 text-left"
            >
              <div className="flex items-center gap-2">
                <ServiceIcon name={cat.icon} className="bg-brand-navy text-white" />
                <span className="font-semibold text-brand-navy">{cat.name}</span>
                <span className="text-xs text-slate-500">({cat.services.length})</span>
              </div>
              {expandedCats[cat._id] ? (
                <ChevronUp className="h-4 w-4 text-slate-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-500" />
              )}
            </button>
            {expandedCats[cat._id] && (
              <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {cat.services.map((s) => {
                  const active = selectedIds.has(s._id);
                  return (
                    <Card
                      key={s._id}
                      className={`p-4 cursor-pointer transition hover:shadow-md ${active ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}
                    >
                      <div className="flex items-center justify-between" onClick={() => toggleService(s._id)}>
                        <div className="flex items-center gap-3">
                          <ServiceIcon name={s.icon} className={s.color || 'bg-orange-100 text-brand-orange'} />
                          <div>
                            <span className="font-medium text-sm">{s.name}</span>
                            <p className="text-xs text-slate-500">₹{s.basePrice} base</p>
                          </div>
                        </div>
                        <label className="relative inline-flex cursor-pointer" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleService(s._id)}
                            className="sr-only peer"
                          />
                          <div className={`h-6 w-11 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5 ${active ? 'bg-green-500' : 'bg-slate-200'}`} />
                        </label>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <Card className="p-5 space-y-4">
        <h3 className="font-semibold text-brand-navy">Service Area Settings</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Service Radius (km)</label>
            <Input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              min={1}
              max={100}
            />
            <p className="text-xs text-slate-500 mt-1">Customers within this radius will see you</p>
          </div>
          <div>
            <label className="text-sm font-medium">Current Location</label>
            <div className="flex items-center gap-2 mt-1">
              <Button variant="outline" size="sm" onClick={captureLocation} disabled={locLoading}>
                <MapPin className="h-4 w-4 mr-1" />
                {locLoading ? 'Capturing...' : 'Update Location'}
              </Button>
              {profile?.currentLocation && (
                <span className="text-xs text-green-600">
                  {profile.currentLocation.coordinates[1].toFixed(4)}, {profile.currentLocation.coordinates[0].toFixed(4)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">Update to show accurately on customer map</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
