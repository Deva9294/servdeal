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

// Flat list for backward compatibility - 70+ services
export const SERVICES: ServiceItem[] = [
  // Home Services
  { name: 'AC Repair', slug: 'ac-repair', icon: 'Snowflake', basePrice: 499, color: 'bg-sky-100 text-sky-600', description: 'Expert AC repair & servicing' },
  { name: 'AC Installation', slug: 'ac-installation', icon: 'Snowflake', basePrice: 1499, color: 'bg-sky-100 text-sky-600', description: 'AC install & uninstall' },
  { name: 'Electrician', slug: 'electrician', icon: 'Zap', basePrice: 299, color: 'bg-amber-100 text-amber-600', description: 'Licensed electricians' },
  { name: 'Emergency Electrician', slug: 'emergency-electrician', icon: 'Flame', basePrice: 499, color: 'bg-red-100 text-red-600', description: '24/7 emergency electrician' },
  { name: 'Plumbing', slug: 'plumbing', icon: 'Droplets', basePrice: 349, color: 'bg-cyan-100 text-cyan-600', description: 'Leak fixes & installations' },
  { name: 'Carpenter', slug: 'carpenter', icon: 'Hammer', basePrice: 499, color: 'bg-yellow-100 text-yellow-700', description: 'Furniture & woodwork' },
  { name: 'Painting', slug: 'painting', icon: 'Paintbrush', basePrice: 1999, color: 'bg-orange-100 text-orange-600', description: 'Interior & exterior' },
  { name: 'Cleaning', slug: 'cleaning', icon: 'Sparkles', basePrice: 599, color: 'bg-emerald-100 text-emerald-600', description: 'Deep home cleaning' },
  { name: 'Deep Cleaning', slug: 'deep-cleaning', icon: 'Bath', basePrice: 799, color: 'bg-teal-100 text-teal-600', description: 'Deep home sanitization' },
  { name: 'Pest Control', slug: 'pest-control', icon: 'Bug', basePrice: 799, color: 'bg-lime-100 text-lime-700', description: 'Safe pest treatment' },
  { name: 'Waterproofing', slug: 'waterproofing', icon: 'CloudRain', basePrice: 1999, color: 'bg-blue-100 text-blue-600', description: 'Roof & wall waterproofing' },
  { name: 'Locksmith', slug: 'locksmith', icon: 'Lock', basePrice: 299, color: 'bg-gray-100 text-gray-600', description: 'Door & lock repair' },
  { name: 'Glass Repair', slug: 'glass-repair', icon: 'PanelsTopLeft', basePrice: 299, color: 'bg-cyan-100 text-cyan-600', description: 'Window & glass fixing' },
  { name: 'Tile Fixing', slug: 'tile-fixing', icon: 'Grid3x3', basePrice: 1999, color: 'bg-stone-100 text-stone-600', description: 'Floor & wall tile work' },
  { name: 'False Ceiling', slug: 'false-ceiling', icon: 'Layers', basePrice: 2499, color: 'bg-blue-100 text-blue-600', description: 'POP & gypsum ceiling' },
  { name: 'Modular Kitchen', slug: 'modular-kitchen', icon: 'CookingPot', basePrice: 25000, color: 'bg-orange-100 text-orange-600', description: 'Custom modular kitchen' },
  { name: 'Smart Home', slug: 'smart-home', icon: 'Wifi', basePrice: 4999, color: 'bg-cyan-100 text-cyan-600', description: 'Smart home automation' },
  { name: 'Water Tank Cleaning', slug: 'water-tank-cleaning', icon: 'Droplet', basePrice: 499, color: 'bg-teal-100 text-teal-600', description: 'Tank cleaning & maintenance' },
  { name: 'Sofa Cleaning', slug: 'sofa-cleaning', icon: 'Sofa', basePrice: 399, color: 'bg-emerald-100 text-emerald-600', description: 'Sofa & carpet cleaning' },
  
  // Appliance Services
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: 'WashingMachine', basePrice: 449, color: 'bg-indigo-100 text-indigo-600', description: 'All appliance repair' },
  { name: 'Washing Machine', slug: 'washing-machine-repair', icon: 'WashingMachine', basePrice: 399, color: 'bg-indigo-100 text-indigo-600', description: 'Washing machine repair' },
  { name: 'RO Service', slug: 'ro-service', icon: 'Droplet', basePrice: 399, color: 'bg-teal-100 text-teal-600', description: 'RO install & service' },
  { name: 'Inverter Repair', slug: 'inverter-repair', icon: 'Battery', basePrice: 499, color: 'bg-yellow-100 text-yellow-600', description: 'Inverter & battery repair' },
  { name: 'Fan Repair', slug: 'fan-repair', icon: 'Fan', basePrice: 199, color: 'bg-cyan-100 text-cyan-600', description: 'Ceiling & exhaust fan repair' },
  { name: 'Refrigerator Repair', slug: 'refrigerator-repair', icon: 'Refrigerator', basePrice: 499, color: 'bg-blue-100 text-blue-600', description: 'Fridge repair & service' },
  { name: 'Microwave Repair', slug: 'microwave-repair', icon: 'Microwave', basePrice: 349, color: 'bg-purple-100 text-purple-600', description: 'Microwave oven repair' },
  { name: 'Chimney Service', slug: 'chimney-service', icon: 'Fan', basePrice: 399, color: 'bg-gray-100 text-gray-600', description: 'Chimney cleaning & repair' },
  { name: 'Geyser Repair', slug: 'geyser-repair', icon: 'Droplet', basePrice: 299, color: 'bg-orange-100 text-orange-600', description: 'Water heater repair' },
  { name: 'Dishwasher Repair', slug: 'dishwasher-repair', icon: 'Utensils', basePrice: 499, color: 'bg-cyan-100 text-cyan-600', description: 'Dishwasher service' },
  
  // Electronics Services
  { name: 'Mobile Repair', slug: 'mobile-repair', icon: 'Smartphone', basePrice: 499, color: 'bg-purple-100 text-purple-600', description: 'Screen & battery fix' },
  { name: 'Laptop Repair', slug: 'laptop-repair', icon: 'Laptop', basePrice: 599, color: 'bg-fuchsia-100 text-fuchsia-600', description: 'Laptop & PC repair' },
  { name: 'Computer Repair', slug: 'computer-repair', icon: 'Monitor', basePrice: 499, color: 'bg-blue-100 text-blue-600', description: 'Desktop & PC repair' },
  { name: 'Printer Repair', slug: 'printer-repair', icon: 'Printer', basePrice: 349, color: 'bg-slate-100 text-slate-600', description: 'Printer & scanner repair' },
  { name: 'CCTV Installation', slug: 'cctv-installation', icon: 'Cctv', basePrice: 999, color: 'bg-slate-100 text-slate-600', description: 'Security setup' },
  { name: 'CCTV Repair', slug: 'cctv-repair', icon: 'Cctv', basePrice: 399, color: 'bg-slate-100 text-slate-600', description: 'CCTV maintenance & repair' },
  { name: 'Network Setup', slug: 'network-setup', icon: 'Wifi', basePrice: 599, color: 'bg-purple-100 text-purple-600', description: 'WiFi & CCTV networking' },
  { name: 'TV Repair', slug: 'tv-repair', icon: 'Monitor', basePrice: 599, color: 'bg-indigo-100 text-indigo-600', description: 'LED/LCD TV repair' },
  { name: 'Tablet Repair', slug: 'tablet-repair', icon: 'Tablet', basePrice: 499, color: 'bg-pink-100 text-pink-600', description: 'iPad & tablet repair' },
  { name: 'Game Console Repair', slug: 'game-console-repair', icon: 'Gamepad2', basePrice: 699, color: 'bg-violet-100 text-violet-600', description: 'PS, Xbox repair' },
  
  // Construction & Labor
  { name: 'Home Construction', slug: 'home-construction', icon: 'Building2', basePrice: 50000, color: 'bg-stone-100 text-stone-600', description: 'Complete house construction' },
  { name: 'Renovation', slug: 'renovation', icon: 'HardHat', basePrice: 15000, color: 'bg-orange-100 text-orange-600', description: 'Home & office renovation' },
  { name: 'Interior Design', slug: 'interior-design', icon: 'Palette', basePrice: 15000, color: 'bg-violet-100 text-violet-600', description: 'Modern interior design' },
  { name: 'Architect', slug: 'architect', icon: 'Pencil', basePrice: 5000, color: 'bg-slate-100 text-slate-600', description: 'Architecture & planning' },
  { name: 'Industrial Welding', slug: 'industrial-welding', icon: 'Flame', basePrice: 999, color: 'bg-orange-100 text-orange-600', description: 'Industrial welding & repair' },
  { name: 'Masonry Work', slug: 'masonry-work', icon: 'Wall', basePrice: 999, color: 'bg-stone-100 text-stone-600', description: 'Brick & stone work' },
  { name: 'Demolition', slug: 'demolition', icon: 'Hammer', basePrice: 2999, color: 'bg-red-100 text-red-600', description: 'Safe demolition services' },
  { name: 'Excavation', slug: 'excavation', icon: 'Pickaxe', basePrice: 1999, color: 'bg-amber-100 text-amber-600', description: 'Land excavation & digging' },
  { name: 'Concrete Work', slug: 'concrete-work', icon: 'Building', basePrice: 1499, color: 'bg-gray-100 text-gray-600', description: 'Concrete pouring & finishing' },
  { name: 'Steel Fabrication', slug: 'steel-fabrication', icon: 'Wrench', basePrice: 2499, color: 'bg-slate-100 text-slate-600', description: 'Steel structure work' },
  
  // Vehicle Services
  { name: 'Car Wash', slug: 'car-wash', icon: 'Car', basePrice: 399, color: 'bg-blue-100 text-blue-600', description: 'Premium car spa' },
  { name: 'Bike Repair', slug: 'bike-repair', icon: 'Bike', basePrice: 249, color: 'bg-violet-100 text-violet-600', description: 'Quick bike fixes' },
  { name: 'Puncture Repair', slug: 'puncture-repair', icon: 'CircleDot', basePrice: 99, color: 'bg-gray-100 text-gray-600', description: 'Quick tyre puncture fix' },
  { name: 'Towing Service', slug: 'towing', icon: 'Truck', basePrice: 999, color: 'bg-red-100 text-red-600', description: 'Vehicle towing 24/7' },
  { name: 'Car Detailing', slug: 'car-detailing', icon: 'Sparkles', basePrice: 799, color: 'bg-emerald-100 text-emerald-600', description: 'Premium car detailing' },
  { name: 'Battery Jump Start', slug: 'battery-jump', icon: 'Zap', basePrice: 299, color: 'bg-yellow-100 text-yellow-600', description: 'Car battery jump start' },
  { name: 'Oil Change', slug: 'oil-change', icon: 'Droplet', basePrice: 499, color: 'bg-amber-100 text-amber-600', description: 'Engine oil change service' },
  { name: 'Car AC Service', slug: 'car-ac-service', icon: 'Snowflake', basePrice: 599, color: 'bg-sky-100 text-sky-600', description: 'Car AC gas & repair' },
  
  // Beauty & Wellness
  { name: 'Beauty Services', slug: 'beauty-services', icon: 'Sparkle', basePrice: 699, color: 'bg-pink-100 text-pink-600', description: 'Salon at home' },
  { name: 'Hair Spa', slug: 'hair-spa', icon: 'Scissors', basePrice: 599, color: 'bg-pink-100 text-pink-600', description: 'Hair & beauty care' },
  { name: 'Makeup Artist', slug: 'makeup-artist', icon: 'Palette', basePrice: 1499, color: 'bg-rose-100 text-rose-600', description: 'Professional makeup' },
  { name: 'Mehndi Artist', slug: 'mehndi-artist', icon: 'Flower2', basePrice: 499, color: 'bg-orange-100 text-orange-600', description: 'Mehndi designs' },
  { name: 'Spa & Massage', slug: 'spa-massage', icon: 'Activity', basePrice: 999, color: 'bg-green-100 text-green-600', description: 'Relaxing spa therapy' },
  { name: 'Yoga Instructor', slug: 'yoga-instructor', icon: 'Activity', basePrice: 499, color: 'bg-purple-100 text-purple-600', description: 'Home yoga classes' },
  { name: 'Fitness Trainer', slug: 'fitness-trainer', icon: 'Dumbbell', basePrice: 599, color: 'bg-red-100 text-red-600', description: 'Personal fitness training' },
  { name: 'Nail Art', slug: 'nail-art', icon: 'Hand', basePrice: 399, color: 'bg-pink-100 text-pink-600', description: 'Manicure & pedicure' },
  
  // Healthcare
  { name: 'Nursing Care', slug: 'nursing-care', icon: 'Heart', basePrice: 999, color: 'bg-rose-100 text-rose-600', description: 'Professional nursing at home' },
  { name: 'Physiotherapy', slug: 'physiotherapy', icon: 'Activity', basePrice: 799, color: 'bg-green-100 text-green-600', description: 'Home physiotherapy sessions' },
  { name: 'Doctor Consultation', slug: 'doctor-consultation', icon: 'Stethoscope', basePrice: 299, color: 'bg-blue-100 text-blue-600', description: 'Online doctor consultation' },
  { name: 'Lab Test at Home', slug: 'lab-test-home', icon: 'TestTube', basePrice: 499, color: 'bg-purple-100 text-purple-600', description: 'Home sample collection' },
  { name: 'Elderly Care', slug: 'elderly-care', icon: 'Heart', basePrice: 899, color: 'bg-amber-100 text-amber-600', description: 'Senior citizen care' },
  { name: 'Baby Care', slug: 'baby-care', icon: 'Baby', basePrice: 699, color: 'bg-pink-100 text-pink-600', description: 'Newborn & baby care' },
  
  // Education
  { name: 'Home Tutor', slug: 'home-tutor', icon: 'GraduationCap', basePrice: 399, color: 'bg-cyan-100 text-cyan-600', description: 'Expert home tutoring' },
  { name: 'Music Teacher', slug: 'music-teacher', icon: 'Music', basePrice: 499, color: 'bg-violet-100 text-violet-600', description: 'Instrument & vocal training' },
  { name: 'Dance Instructor', slug: 'dance-instructor', icon: 'Music', basePrice: 499, color: 'bg-pink-100 text-pink-600', description: 'Dance classes at home' },
  { name: 'Art Classes', slug: 'art-classes', icon: 'Palette', basePrice: 399, color: 'bg-orange-100 text-orange-600', description: 'Painting & drawing classes' },
  { name: 'Language Tutor', slug: 'language-tutor', icon: 'BookOpen', basePrice: 349, color: 'bg-blue-100 text-blue-600', description: 'Learn new languages' },
  
  // Business & Legal
  { name: 'GST Filing', slug: 'gst-filing', icon: 'FileText', basePrice: 499, color: 'bg-amber-100 text-amber-600', description: 'GST & tax compliance' },
  { name: 'Legal Advisor', slug: 'legal-advisor', icon: 'Scale', basePrice: 999, color: 'bg-amber-100 text-amber-600', description: 'Legal & documentation help' },
  { name: 'PAN Card Service', slug: 'pan-card', icon: 'Landmark', basePrice: 199, color: 'bg-blue-100 text-blue-600', description: 'PAN, Aadhaar & certificates' },
  { name: 'Accounting', slug: 'accounting', icon: 'Calculator', basePrice: 799, color: 'bg-green-100 text-green-600', description: 'Bookkeeping & accounting' },
  { name: 'Business Registration', slug: 'business-registration', icon: 'Briefcase', basePrice: 1499, color: 'bg-slate-100 text-slate-600', description: 'Company registration' },
  
  // Digital Services
  { name: 'Website Development', slug: 'website-development', icon: 'Monitor', basePrice: 9999, color: 'bg-indigo-100 text-indigo-600', description: 'Custom website & apps' },
  { name: 'Digital Marketing', slug: 'digital-marketing', icon: 'TrendingUp', basePrice: 4999, color: 'bg-purple-100 text-purple-600', description: 'SEO & digital marketing' },
  { name: 'Content Writer', slug: 'content-writer', icon: 'PenTool', basePrice: 999, color: 'bg-violet-100 text-violet-600', description: 'Content & copywriting' },
  { name: 'Graphic Design', slug: 'graphic-design', icon: 'Palette', basePrice: 799, color: 'bg-pink-100 text-pink-600', description: 'Logo & branding design' },
  { name: 'Video Editing', slug: 'video-editing', icon: 'Video', basePrice: 1499, color: 'bg-red-100 text-red-600', description: 'Professional video editing' },
  { name: 'Social Media Management', slug: 'social-media', icon: 'Share2', basePrice: 2999, color: 'bg-blue-100 text-blue-600', description: 'Social media handling' },
  
  // Events
  { name: 'Event Photography', slug: 'event-photography', icon: 'Camera', basePrice: 4999, color: 'bg-red-100 text-red-600', description: 'Professional event photo/video' },
  { name: 'Catering Service', slug: 'catering', icon: 'UtensilsCrossed', basePrice: 2999, color: 'bg-orange-100 text-orange-600', description: 'Event & party catering' },
  { name: 'Wedding Planner', slug: 'wedding-planner', icon: 'PartyPopper', basePrice: 25000, color: 'bg-pink-100 text-pink-600', description: 'Complete wedding planning' },
  { name: 'Event Decorator', slug: 'event-decorator', icon: 'Sparkles', basePrice: 4999, color: 'bg-purple-100 text-purple-600', description: 'Event decoration' },
  { name: 'DJ Service', slug: 'dj-service', icon: 'Music', basePrice: 2999, color: 'bg-violet-100 text-violet-600', description: 'Professional DJ & sound' },
  { name: 'Tent House', slug: 'tent-house', icon: 'Home', basePrice: 1999, color: 'bg-amber-100 text-amber-600', description: 'Tent & furniture rental' },
  
  // Transport & Movers
  { name: 'Home Shifting', slug: 'home-shifting', icon: 'Truck', basePrice: 4999, color: 'bg-rose-100 text-rose-600', description: 'Packers & movers' },
  { name: 'Packers & Movers', slug: 'packers-movers', icon: 'Package', basePrice: 2999, color: 'bg-blue-100 text-blue-600', description: 'Safe packing & moving' },
  { name: 'Courier Service', slug: 'courier', icon: 'Package', basePrice: 199, color: 'bg-amber-100 text-amber-600', description: 'Local & national courier' },
  { name: 'Local Transport', slug: 'local-transport', icon: 'Car', basePrice: 299, color: 'bg-green-100 text-green-600', description: 'Local taxi service' },
  
  // Agriculture
  { name: 'Borewell Service', slug: 'borewell', icon: 'Droplets', basePrice: 15000, color: 'bg-cyan-100 text-cyan-600', description: 'Borewell drilling & repair' },
  { name: 'Tractor Rental', slug: 'tractor-rental', icon: 'Tractor', basePrice: 2000, color: 'bg-green-100 text-green-600', description: 'Tractor & farm equipment' },
  { name: 'Irrigation Setup', slug: 'irrigation-setup', icon: 'Sprout', basePrice: 4999, color: 'bg-emerald-100 text-emerald-600', description: 'Farm irrigation systems' },
  { name: 'Crop Consulting', slug: 'crop-consulting', icon: 'Sprout', basePrice: 799, color: 'bg-lime-100 text-lime-700', description: 'Agriculture consulting' },
  
  // Security
  { name: 'Security Guard', slug: 'security-guard', icon: 'Shield', basePrice: 800, color: 'bg-green-100 text-green-600', description: 'Trained security personnel' },
  { name: 'Fire Safety', slug: 'fire-safety', icon: 'Flame', basePrice: 999, color: 'bg-red-100 text-red-600', description: 'Fire safety inspection' },
  { name: 'Bouncer Service', slug: 'bouncer-service', icon: 'Shield', basePrice: 999, color: 'bg-slate-100 text-slate-600', description: 'Event security' },
  
  // Rentals
  { name: 'Generator Rental', slug: 'generator-rental', icon: 'Plug', basePrice: 1500, color: 'bg-slate-100 text-slate-600', description: 'Generator & equipment rental' },
  { name: 'JCB Rental', slug: 'jcb-rental', icon: 'Pickaxe', basePrice: 3000, color: 'bg-stone-100 text-stone-600', description: 'JCB, crane & tractor rental' },
  { name: 'Furniture Rental', slug: 'furniture-rental', icon: 'Sofa', basePrice: 999, color: 'bg-amber-100 text-amber-600', description: 'Furniture on rent' },
  { name: 'Camera Rental', slug: 'camera-rental', icon: 'Camera', basePrice: 1499, color: 'bg-purple-100 text-purple-600', description: 'Photo/video equipment' },
  
  // Home Help
  { name: 'Cook / Maid', slug: 'cook-maid', icon: 'ChefHat', basePrice: 499, color: 'bg-orange-100 text-orange-600', description: 'Home cook & maid services' },
  { name: 'Laundry', slug: 'laundry', icon: 'Shirt', basePrice: 199, color: 'bg-blue-100 text-blue-600', description: 'Wash & iron services' },
  { name: 'Pet Care', slug: 'pet-care', icon: 'Dog', basePrice: 399, color: 'bg-orange-100 text-orange-600', description: 'Pet sitting & grooming' },
  { name: 'Scrap Collection', slug: 'scrap-collection', icon: 'Recycle', basePrice: 0, color: 'bg-green-100 text-green-600', description: 'Scrap & waste collection' },
  { name: 'Grocery Delivery', slug: 'grocery-delivery', icon: 'ShoppingCart', basePrice: 99, color: 'bg-emerald-100 text-emerald-600', description: 'Home grocery delivery' },
  { name: 'Tiffin Service', slug: 'tiffin-service', icon: 'Utensils', basePrice: 199, color: 'bg-orange-100 text-orange-600', description: 'Home-cooked meals' },
  
  // Solar & Energy
  { name: 'Solar Panel', slug: 'solar-panel', icon: 'Sun', basePrice: 25000, color: 'bg-yellow-100 text-yellow-600', description: 'Solar install & repair' },
  { name: 'Inverter Installation', slug: 'inverter-installation', icon: 'Battery', basePrice: 1499, color: 'bg-amber-100 text-amber-600', description: 'Inverter setup' },
  
  // Gardening
  { name: 'Gardening', slug: 'gardening', icon: 'TreePine', basePrice: 399, color: 'bg-green-100 text-green-600', description: 'Garden & lawn care' },
  { name: 'Landscaping', slug: 'landscaping', icon: 'TreePine', basePrice: 1999, color: 'bg-emerald-100 text-emerald-600', description: 'Garden design & setup' },
];

// Grouped by category for SEO and display - 70+ categories
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    title: 'AC Services',
    slug: 'ac-services',
    icon: 'Snowflake',
    services: SERVICES.filter((s) => ['ac-repair', 'ac-installation', 'car-ac-service'].includes(s.slug)),
  },
  {
    title: 'Electrician',
    slug: 'electrician',
    icon: 'Zap',
    services: SERVICES.filter((s) => ['electrician', 'emergency-electrician', 'fan-repair', 'inverter-repair', 'inverter-installation'].includes(s.slug)),
  },
  {
    title: 'Plumbing',
    slug: 'plumbing',
    icon: 'Droplets',
    services: SERVICES.filter((s) => ['plumbing', 'waterproofing', 'water-tank-cleaning', 'geyser-repair', 'borewell'].includes(s.slug)),
  },
  {
    title: 'Carpenter',
    slug: 'carpenter',
    icon: 'Hammer',
    services: SERVICES.filter((s) => ['carpenter', 'furniture-rental', 'sofa-cleaning'].includes(s.slug)),
  },
  {
    title: 'Painting',
    slug: 'painting',
    icon: 'Paintbrush',
    services: SERVICES.filter((s) => ['painting', 'wallpaper', 'texture-painting'].includes(s.slug)),
  },
  {
    title: 'Cleaning',
    slug: 'cleaning',
    icon: 'Sparkles',
    services: SERVICES.filter((s) => ['cleaning', 'deep-cleaning', 'sofa-cleaning', 'water-tank-cleaning', 'car-detailing'].includes(s.slug)),
  },
  {
    title: 'Pest Control',
    slug: 'pest-control',
    icon: 'Bug',
    services: SERVICES.filter((s) => ['pest-control'].includes(s.slug)),
  },
  {
    title: 'Appliance Repair',
    slug: 'appliance-repair',
    icon: 'WashingMachine',
    services: SERVICES.filter((s) => ['appliance-repair', 'washing-machine-repair', 'ro-service', 'refrigerator-repair', 'microwave-repair', 'chimney-service', 'geyser-repair', 'dishwasher-repair'].includes(s.slug)),
  },
  {
    title: 'Mobile Repair',
    slug: 'mobile-repair',
    icon: 'Smartphone',
    services: SERVICES.filter((s) => ['mobile-repair', 'tablet-repair', 'battery-jump'].includes(s.slug)),
  },
  {
    title: 'Laptop & Computer',
    slug: 'laptop-computer',
    icon: 'Laptop',
    services: SERVICES.filter((s) => ['laptop-repair', 'computer-repair', 'printer-repair', 'tv-repair', 'game-console-repair'].includes(s.slug)),
  },
  {
    title: 'CCTV & Security',
    slug: 'cctv-security',
    icon: 'Cctv',
    services: SERVICES.filter((s) => ['cctv-installation', 'cctv-repair', 'network-setup', 'security-guard', 'fire-safety', 'bouncer-service'].includes(s.slug)),
  },
  {
    title: 'Construction',
    slug: 'construction',
    icon: 'Building2',
    services: SERVICES.filter((s) => ['home-construction', 'renovation', 'interior-design', 'architect', 'masonry-work', 'demolition', 'excavation', 'concrete-work', 'steel-fabrication', 'tile-fixing', 'false-ceiling', 'modular-kitchen', 'waterproofing', 'glass-repair'].includes(s.slug)),
  },
  {
    title: 'Car Services',
    slug: 'car-services',
    icon: 'Car',
    services: SERVICES.filter((s) => ['car-wash', 'car-detailing', 'battery-jump', 'oil-change', 'car-ac-service'].includes(s.slug)),
  },
  {
    title: 'Bike Services',
    slug: 'bike-services',
    icon: 'Bike',
    services: SERVICES.filter((s) => ['bike-repair', 'puncture-repair'].includes(s.slug)),
  },
  {
    title: 'Towing',
    slug: 'towing',
    icon: 'Truck',
    services: SERVICES.filter((s) => ['towing'].includes(s.slug)),
  },
  {
    title: 'Beauty Services',
    slug: 'beauty-services',
    icon: 'Sparkle',
    services: SERVICES.filter((s) => ['beauty-services', 'hair-spa', 'makeup-artist', 'mehndi-artist', 'nail-art'].includes(s.slug)),
  },
  {
    title: 'Spa & Wellness',
    slug: 'spa-wellness',
    icon: 'Activity',
    services: SERVICES.filter((s) => ['spa-massage', 'yoga-instructor', 'fitness-trainer'].includes(s.slug)),
  },
  {
    title: 'Healthcare',
    slug: 'healthcare',
    icon: 'Heart',
    services: SERVICES.filter((s) => ['nursing-care', 'physiotherapy', 'doctor-consultation', 'lab-test-home', 'elderly-care', 'baby-care'].includes(s.slug)),
  },
  {
    title: 'Tutoring',
    slug: 'tutoring',
    icon: 'GraduationCap',
    services: SERVICES.filter((s) => ['home-tutor', 'music-teacher', 'dance-instructor', 'art-classes', 'language-tutor'].includes(s.slug)),
  },
  {
    title: 'Business Services',
    slug: 'business-services',
    icon: 'Briefcase',
    services: SERVICES.filter((s) => ['gst-filing', 'legal-advisor', 'pan-card', 'accounting', 'business-registration'].includes(s.slug)),
  },
  {
    title: 'Digital Services',
    slug: 'digital-services',
    icon: 'Monitor',
    services: SERVICES.filter((s) => ['website-development', 'digital-marketing', 'content-writer', 'graphic-design', 'video-editing', 'social-media'].includes(s.slug)),
  },
  {
    title: 'Photography',
    slug: 'photography',
    icon: 'Camera',
    services: SERVICES.filter((s) => ['event-photography', 'camera-rental'].includes(s.slug)),
  },
  {
    title: 'Events',
    slug: 'events',
    icon: 'PartyPopper',
    services: SERVICES.filter((s) => ['event-photography', 'catering', 'wedding-planner', 'event-decorator', 'dj-service', 'tent-house'].includes(s.slug)),
  },
  {
    title: 'Packers & Movers',
    slug: 'packers-movers',
    icon: 'Truck',
    services: SERVICES.filter((s) => ['home-shifting', 'packers-movers', 'courier', 'local-transport'].includes(s.slug)),
  },
  {
    title: 'Agriculture',
    slug: 'agriculture',
    icon: 'Sprout',
    services: SERVICES.filter((s) => ['tractor-rental', 'irrigation-setup', 'borewell', 'crop-consulting'].includes(s.slug)),
  },
  {
    title: 'Rentals',
    slug: 'rentals',
    icon: 'Pickaxe',
    services: SERVICES.filter((s) => ['generator-rental', 'jcb-rental', 'tractor-rental', 'furniture-rental', 'camera-rental', 'tent-house'].includes(s.slug)),
  },
  {
    title: 'Home Help',
    slug: 'home-help',
    icon: 'ChefHat',
    services: SERVICES.filter((s) => ['cook-maid', 'laundry', 'pet-care', 'scrap-collection', 'grocery-delivery', 'tiffin-service'].includes(s.slug)),
  },
  {
    title: 'Solar & Energy',
    slug: 'solar-energy',
    icon: 'Sun',
    services: SERVICES.filter((s) => ['solar-panel', 'inverter-installation'].includes(s.slug)),
  },
  {
    title: 'Gardening',
    slug: 'gardening',
    icon: 'TreePine',
    services: SERVICES.filter((s) => ['gardening', 'landscaping'].includes(s.slug)),
  },
  {
    title: 'Smart Home',
    slug: 'smart-home',
    icon: 'Wifi',
    services: SERVICES.filter((s) => ['smart-home', 'network-setup'].includes(s.slug)),
  },
  {
    title: 'Locksmith',
    slug: 'locksmith',
    icon: 'Lock',
    services: SERVICES.filter((s) => ['locksmith'].includes(s.slug)),
  },
  {
    title: 'Welding',
    slug: 'welding',
    icon: 'Flame',
    services: SERVICES.filter((s) => ['industrial-welding'].includes(s.slug)),
  },
];

export const getServiceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const getServicesByCategory = (slug: string) => SERVICE_CATEGORIES.find((c) => c.slug === slug)?.services || [];
