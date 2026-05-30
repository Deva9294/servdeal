export type ServiceItem = {
  name: string;
  slug: string;
  icon: string;
  basePrice: number;
  color: string;
  description: string;
};

export type ServiceCategory = {
  title: string;
  slug: string;
  icon: string;
  services: ServiceItem[];
};

// Flat list for backward compatibility
export const SERVICES: ServiceItem[] = [
  // Existing services
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
  // New services
  { name: 'Home Construction', slug: 'home-construction', icon: 'Building2', basePrice: 50000, color: 'bg-stone-100 text-stone-600', description: 'Complete house construction' },
  { name: 'Renovation', slug: 'renovation', icon: 'HardHat', basePrice: 15000, color: 'bg-orange-100 text-orange-600', description: 'Home & office renovation' },
  { name: 'Security Guard', slug: 'security-guard', icon: 'Shield', basePrice: 800, color: 'bg-green-100 text-green-600', description: 'Trained security personnel' },
  { name: 'Event Photography', slug: 'event-photography', icon: 'Camera', basePrice: 4999, color: 'bg-red-100 text-red-600', description: 'Professional event photo/video' },
  { name: 'Packers & Movers', slug: 'packers-movers', icon: 'Package', basePrice: 2999, color: 'bg-blue-100 text-blue-600', description: 'Safe packing & moving' },
  { name: 'Home Tutor', slug: 'home-tutor', icon: 'GraduationCap', basePrice: 399, color: 'bg-cyan-100 text-cyan-600', description: 'Expert home tutoring' },
  { name: 'Nursing Care', slug: 'nursing-care', icon: 'Heart', basePrice: 999, color: 'bg-rose-100 text-rose-600', description: 'Professional nursing at home' },
  { name: 'Website Development', slug: 'website-development', icon: 'Monitor', basePrice: 9999, color: 'bg-indigo-100 text-indigo-600', description: 'Custom website & apps' },
  { name: 'GST Filing', slug: 'gst-filing', icon: 'FileText', basePrice: 499, color: 'bg-amber-100 text-amber-600', description: 'GST & tax compliance' },
  { name: 'Solar Panel', slug: 'solar-panel', icon: 'Sun', basePrice: 25000, color: 'bg-yellow-100 text-yellow-600', description: 'Solar install & repair' },
  { name: 'Gardening', slug: 'gardening', icon: 'TreePine', basePrice: 399, color: 'bg-green-100 text-green-600', description: 'Garden & lawn care' },
  { name: 'Generator Rental', slug: 'generator-rental', icon: 'Plug', basePrice: 1500, color: 'bg-slate-100 text-slate-600', description: 'Generator & equipment rental' },
  { name: 'Puncture Repair', slug: 'puncture-repair', icon: 'CircleDot', basePrice: 99, color: 'bg-gray-100 text-gray-600', description: 'Quick tyre puncture fix' },
  { name: 'Deep Cleaning', slug: 'deep-cleaning', icon: 'Bath', basePrice: 799, color: 'bg-teal-100 text-teal-600', description: 'Deep home sanitization' },
  { name: 'Hair Spa', slug: 'hair-spa', icon: 'Scissors', basePrice: 599, color: 'bg-pink-100 text-pink-600', description: 'Hair & beauty care' },
  { name: 'Cook / Maid', slug: 'cook-maid', icon: 'ChefHat', basePrice: 499, color: 'bg-orange-100 text-orange-600', description: 'Home cook & maid services' },
  { name: 'PAN Card Service', slug: 'pan-card', icon: 'Landmark', basePrice: 199, color: 'bg-blue-100 text-blue-600', description: 'PAN, Aadhaar & certificates' },
  { name: 'Emergency Electrician', slug: 'emergency-electrician', icon: 'Flame', basePrice: 499, color: 'bg-red-100 text-red-600', description: '24/7 emergency electrician' },
  { name: 'JCB Rental', slug: 'jcb-rental', icon: 'Pickaxe', basePrice: 3000, color: 'bg-stone-100 text-stone-600', description: 'JCB, crane & tractor rental' },
  { name: 'Industrial Welding', slug: 'industrial-welding', icon: 'Flame', basePrice: 999, color: 'bg-orange-100 text-orange-600', description: 'Industrial welding & repair' },
  { name: 'Smart Home', slug: 'smart-home', icon: 'Wifi', basePrice: 4999, color: 'bg-cyan-100 text-cyan-600', description: 'Smart home automation' },
  { name: 'Waterproofing', slug: 'waterproofing', icon: 'CloudRain', basePrice: 1999, color: 'bg-blue-100 text-blue-600', description: 'Roof & wall waterproofing' },
  { name: 'Interior Design', slug: 'interior-design', icon: 'Palette', basePrice: 15000, color: 'bg-violet-100 text-violet-600', description: 'Modern interior design' },
  { name: 'Physiotherapy', slug: 'physiotherapy', icon: 'Activity', basePrice: 799, color: 'bg-green-100 text-green-600', description: 'Home physiotherapy sessions' },
  { name: 'Digital Marketing', slug: 'digital-marketing', icon: 'TrendingUp', basePrice: 4999, color: 'bg-purple-100 text-purple-600', description: 'SEO & digital marketing' },
  { name: 'Catering Service', slug: 'catering', icon: 'UtensilsCrossed', basePrice: 2999, color: 'bg-orange-100 text-orange-600', description: 'Event & party catering' },
  { name: 'Courier Service', slug: 'courier', icon: 'Package', basePrice: 199, color: 'bg-amber-100 text-amber-600', description: 'Local & national courier' },
  { name: 'Wedding Planner', slug: 'wedding-planner', icon: 'PartyPopper', basePrice: 25000, color: 'bg-pink-100 text-pink-600', description: 'Complete wedding planning' },
  { name: 'Borewell Service', slug: 'borewell', icon: 'Droplets', basePrice: 15000, color: 'bg-cyan-100 text-cyan-600', description: 'Borewell drilling & repair' },
  { name: 'Scrap Collection', slug: 'scrap-collection', icon: 'Recycle', basePrice: 0, color: 'bg-green-100 text-green-600', description: 'Scrap & waste collection' },
  { name: 'Fire Safety', slug: 'fire-safety', icon: 'Flame', basePrice: 999, color: 'bg-red-100 text-red-600', description: 'Fire safety inspection' },
  { name: 'Architect', slug: 'architect', icon: 'Pencil', basePrice: 5000, color: 'bg-slate-100 text-slate-600', description: 'Architecture & planning' },
  { name: 'Locksmith', slug: 'locksmith', icon: 'Lock', basePrice: 299, color: 'bg-gray-100 text-gray-600', description: 'Door & lock repair' },
  { name: 'Water Tank Cleaning', slug: 'water-tank-cleaning', icon: 'Droplet', basePrice: 499, color: 'bg-teal-100 text-teal-600', description: 'Tank cleaning & maintenance' },
  { name: 'Sofa Cleaning', slug: 'sofa-cleaning', icon: 'Sofa', basePrice: 399, color: 'bg-emerald-100 text-emerald-600', description: 'Sofa & carpet cleaning' },
  { name: 'AC Installation', slug: 'ac-installation', icon: 'Snowflake', basePrice: 1499, color: 'bg-sky-100 text-sky-600', description: 'AC install & uninstall' },
  { name: 'Washing Machine', slug: 'washing-machine-repair', icon: 'WashingMachine', basePrice: 399, color: 'bg-indigo-100 text-indigo-600', description: 'Washing machine repair' },
  { name: 'Inverter Repair', slug: 'inverter-repair', icon: 'Battery', basePrice: 499, color: 'bg-yellow-100 text-yellow-600', description: 'Inverter & battery repair' },
  { name: 'Fan Repair', slug: 'fan-repair', icon: 'Fan', basePrice: 199, color: 'bg-cyan-100 text-cyan-600', description: 'Ceiling & exhaust fan repair' },
  { name: 'Computer Repair', slug: 'computer-repair', icon: 'Monitor', basePrice: 499, color: 'bg-blue-100 text-blue-600', description: 'Desktop & PC repair' },
  { name: 'Printer Repair', slug: 'printer-repair', icon: 'Printer', basePrice: 349, color: 'bg-slate-100 text-slate-600', description: 'Printer & scanner repair' },
  { name: 'Network Setup', slug: 'network-setup', icon: 'Wifi', basePrice: 599, color: 'bg-purple-100 text-purple-600', description: 'WiFi & CCTV networking' },
  { name: 'Pet Care', slug: 'pet-care', icon: 'Dog', basePrice: 399, color: 'bg-orange-100 text-orange-600', description: 'Pet sitting & grooming' },
  { name: 'Laundry', slug: 'laundry', icon: 'Shirt', basePrice: 199, color: 'bg-blue-100 text-blue-600', description: 'Wash & iron services' },
  { name: 'Content Writer', slug: 'content-writer', icon: 'PenTool', basePrice: 999, color: 'bg-violet-100 text-violet-600', description: 'Content & copywriting' },
  { name: 'Legal Advisor', slug: 'legal-advisor', icon: 'Scale', basePrice: 999, color: 'bg-amber-100 text-amber-600', description: 'Legal & documentation help' },
  { name: 'Towing Service', slug: 'towing', icon: 'Truck', basePrice: 999, color: 'bg-red-100 text-red-600', description: 'Vehicle towing 24/7' },
  { name: 'CCTV Repair', slug: 'cctv-repair', icon: 'Cctv', basePrice: 399, color: 'bg-slate-100 text-slate-600', description: 'CCTV maintenance & repair' },
  { name: 'Glass Repair', slug: 'glass-repair', icon: 'PanelsTopLeft', basePrice: 299, color: 'bg-cyan-100 text-cyan-600', description: 'Window & glass fixing' },
  { name: 'Tile Fixing', slug: 'tile-fixing', icon: 'Grid3x3', basePrice: 1999, color: 'bg-stone-100 text-stone-600', description: 'Floor & wall tile work' },
  { name: 'False Ceiling', slug: 'false-ceiling', icon: 'Layers', basePrice: 2499, color: 'bg-blue-100 text-blue-600', description: 'POP & gypsum ceiling' },
  { name: 'Modular Kitchen', slug: 'modular-kitchen', icon: 'CookingPot', basePrice: 25000, color: 'bg-orange-100 text-orange-600', description: 'Custom modular kitchen' },
  { name: 'Tractor Rental', slug: 'tractor-rental', icon: 'Tractor', basePrice: 2000, color: 'bg-green-100 text-green-600', description: 'Tractor & farm equipment' },
  { name: 'Irrigation Setup', slug: 'irrigation-setup', icon: 'Sprout', basePrice: 4999, color: 'bg-emerald-100 text-emerald-600', description: 'Farm irrigation systems' },
];

// Grouped by category for SEO and display
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    title: 'Home Services',
    slug: 'home-services',
    icon: 'Home',
    services: SERVICES.filter((s) => ['electrician', 'plumbing', 'carpenter', 'painting', 'cleaning', 'deep-cleaning', 'pest-control', 'waterproofing', 'locksmith', 'glass-repair', 'tile-fixing', 'false-ceiling', 'modular-kitchen', 'smart-home'].includes(s.slug)),
  },
  {
    title: 'Repair Services',
    slug: 'repair-services',
    icon: 'Wrench',
    services: SERVICES.filter((s) => ['ac-repair', 'fan-repair', 'inverter-repair', 'water-tank-cleaning', 'sofa-cleaning', 'cctv-repair', 'glass-repair', 'tile-fixing', 'false-ceiling'].includes(s.slug)),
  },
  {
    title: 'Appliance Services',
    slug: 'appliance-services',
    icon: 'Refrigerator',
    services: SERVICES.filter((s) => ['ac-repair', 'ac-installation', 'appliance-repair', 'washing-machine-repair', 'ro-service', 'fan-repair'].includes(s.slug)),
  },
  {
    title: 'Electronics Services',
    slug: 'electronics-services',
    icon: 'Cpu',
    services: SERVICES.filter((s) => ['mobile-repair', 'laptop-repair', 'computer-repair', 'printer-repair', 'cctv-installation', 'cctv-repair', 'network-setup'].includes(s.slug)),
  },
  {
    title: 'Construction & Labor',
    slug: 'construction-labor',
    icon: 'HardHat',
    services: SERVICES.filter((s) => ['home-construction', 'renovation', 'interior-design', 'architect', 'carpenter', 'painting', 'tile-fixing', 'false-ceiling', 'waterproofing', 'modular-kitchen'].includes(s.slug)),
  },
  {
    title: 'Vehicle Services',
    slug: 'vehicle-services',
    icon: 'Car',
    services: SERVICES.filter((s) => ['car-wash', 'bike-repair', 'puncture-repair', 'towing'].includes(s.slug)),
  },
  {
    title: 'Cleaning Services',
    slug: 'cleaning-services',
    icon: 'Sparkles',
    services: SERVICES.filter((s) => ['cleaning', 'deep-cleaning', 'water-tank-cleaning', 'sofa-cleaning', 'pest-control'].includes(s.slug)),
  },
  {
    title: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    icon: 'Sparkle',
    services: SERVICES.filter((s) => ['beauty-services', 'hair-spa', 'cook-maid'].includes(s.slug)),
  },
  {
    title: 'Healthcare',
    slug: 'healthcare',
    icon: 'Heart',
    services: SERVICES.filter((s) => ['nursing-care', 'physiotherapy'].includes(s.slug)),
  },
  {
    title: 'Education',
    slug: 'education',
    icon: 'GraduationCap',
    services: SERVICES.filter((s) => ['home-tutor'].includes(s.slug)),
  },
  {
    title: 'Business & Legal',
    slug: 'business-legal',
    icon: 'Briefcase',
    services: SERVICES.filter((s) => ['gst-filing', 'legal-advisor', 'pan-card'].includes(s.slug)),
  },
  {
    title: 'Digital Services',
    slug: 'digital-services',
    icon: 'Monitor',
    services: SERVICES.filter((s) => ['website-development', 'digital-marketing', 'content-writer', 'network-setup'].includes(s.slug)),
  },
  {
    title: 'Events',
    slug: 'events',
    icon: 'PartyPopper',
    services: SERVICES.filter((s) => ['event-photography', 'catering', 'wedding-planner'].includes(s.slug)),
  },
  {
    title: 'Transport & Movers',
    slug: 'transport-movers',
    icon: 'Truck',
    services: SERVICES.filter((s) => ['home-shifting', 'packers-movers', 'courier', 'towing'].includes(s.slug)),
  },
  {
    title: 'Agriculture',
    slug: 'agriculture',
    icon: 'Sprout',
    services: SERVICES.filter((s) => ['tractor-rental', 'irrigation-setup', 'borewell'].includes(s.slug)),
  },
  {
    title: 'Security',
    slug: 'security',
    icon: 'Shield',
    services: SERVICES.filter((s) => ['security-guard', 'cctv-installation', 'cctv-repair', 'fire-safety', 'network-setup'].includes(s.slug)),
  },
  {
    title: 'Rentals',
    slug: 'rentals',
    icon: 'Pickaxe',
    services: SERVICES.filter((s) => ['generator-rental', 'jcb-rental', 'tractor-rental'].includes(s.slug)),
  },
  {
    title: 'Government Assistance',
    slug: 'government-assistance',
    icon: 'Landmark',
    services: SERVICES.filter((s) => ['pan-card'].includes(s.slug)),
  },
  {
    title: 'Emergency Services',
    slug: 'emergency-services',
    icon: 'Siren',
    services: SERVICES.filter((s) => ['emergency-electrician', 'towing', 'locksmith'].includes(s.slug)),
  },
];

export const getServiceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const getServicesByCategory = (slug: string) => SERVICE_CATEGORIES.find((c) => c.slug === slug)?.services || [];
