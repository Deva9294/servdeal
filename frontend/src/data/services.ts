export type ServiceItem = {
  name: string;
  slug: string;
  icon: string;
  basePrice: number;
  color: string;
  description: string;
};

export const SERVICES: ServiceItem[] = [
  { name: 'AC Repair', slug: 'ac-repair', icon: 'Snowflake', basePrice: 499, color: 'bg-sky-100 text-sky-600', description: 'Expert AC repair & servicing' },
  { name: 'Electrician', slug: 'electrician', icon: 'Zap', basePrice: 299, color: 'bg-amber-100 text-amber-600', description: 'Licensed electricians' },
  { name: 'Plumbing', slug: 'plumbing', icon: 'Droplets', basePrice: 349, color: 'bg-cyan-100 text-cyan-600', description: 'Leak fixes & installations' },
  { name: 'Cleaning', slug: 'cleaning', icon: 'Sparkles', basePrice: 599, color: 'bg-emerald-100 text-emerald-600', description: 'Deep home cleaning' },
  { name: 'Pest Control', slug: 'pest-control', icon: 'Bug', basePrice: 799, color: 'bg-lime-100 text-lime-700', description: 'Safe pest treatment' },
  { name: 'Car Wash', slug: 'car-wash', icon: 'Car', basePrice: 399, color: 'bg-blue-100 text-blue-600', description: 'Premium car spa' },
  { name: 'Beauty Services', slug: 'beauty-services', icon: 'Sparkle', basePrice: 699, color: 'bg-pink-100 text-pink-600', description: 'Salon at home' },
  { name: 'Bike Repair', slug: 'bike-repair', icon: 'Bike', basePrice: 249, color: 'bg-violet-100 text-violet-600', description: 'Quick bike fixes' },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: 'WashingMachine', basePrice: 449, color: 'bg-indigo-100 text-indigo-600', description: 'All appliance repair' },
  { name: 'Painting', slug: 'painting', icon: 'Paintbrush', basePrice: 1999, color: 'bg-orange-100 text-orange-600', description: 'Interior & exterior' },
  { name: 'Carpenter', slug: 'carpenter', icon: 'Hammer', basePrice: 499, color: 'bg-yellow-100 text-yellow-700', description: 'Furniture & woodwork' },
  { name: 'CCTV Installation', slug: 'cctv-installation', icon: 'Cctv', basePrice: 999, color: 'bg-slate-100 text-slate-600', description: 'Security setup' },
  { name: 'RO Service', slug: 'ro-service', icon: 'Droplet', basePrice: 399, color: 'bg-teal-100 text-teal-600', description: 'RO install & service' },
  { name: 'Home Shifting', slug: 'home-shifting', icon: 'Truck', basePrice: 4999, color: 'bg-rose-100 text-rose-600', description: 'Packers & movers' },
  { name: 'Laptop Repair', slug: 'laptop-repair', icon: 'Laptop', basePrice: 599, color: 'bg-fuchsia-100 text-fuchsia-600', description: 'Laptop & PC repair' },
  { name: 'Mobile Repair', slug: 'mobile-repair', icon: 'Smartphone', basePrice: 499, color: 'bg-purple-100 text-purple-600', description: 'Screen & battery fix' },
];

export const getServiceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
