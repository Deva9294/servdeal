import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import Coupon from '../models/Coupon.js';
import Blog from '../models/Blog.js';

const categories = [
  { name: 'Home Services', slug: 'home-services', icon: 'home', sortOrder: 1 },
  { name: 'Repair Services', slug: 'repair-services', icon: 'wrench', sortOrder: 2 },
  { name: 'Appliance Services', slug: 'appliance-services', icon: 'refrigerator', sortOrder: 3 },
  { name: 'Electronics Services', slug: 'electronics-services', icon: 'cpu', sortOrder: 4 },
  { name: 'Construction & Labor', slug: 'construction-labor', icon: 'hard-hat', sortOrder: 5 },
  { name: 'Vehicle Services', slug: 'vehicle-services', icon: 'car', sortOrder: 6 },
  { name: 'Cleaning Services', slug: 'cleaning-services', icon: 'sparkles', sortOrder: 7 },
  { name: 'Beauty & Wellness', slug: 'beauty-wellness', icon: 'sparkle', sortOrder: 8 },
  { name: 'Healthcare', slug: 'healthcare', icon: 'heart', sortOrder: 9 },
  { name: 'Education', slug: 'education', icon: 'graduation-cap', sortOrder: 10 },
  { name: 'Business & Legal', slug: 'business-legal', icon: 'briefcase', sortOrder: 11 },
  { name: 'Digital Services', slug: 'digital-services', icon: 'monitor', sortOrder: 12 },
  { name: 'Events', slug: 'events', icon: 'party-popper', sortOrder: 13 },
  { name: 'Transport & Movers', slug: 'transport-movers', icon: 'truck', sortOrder: 14 },
  { name: 'Agriculture', slug: 'agriculture', icon: 'sprout', sortOrder: 15 },
  { name: 'Security', slug: 'security', icon: 'shield', sortOrder: 16 },
  { name: 'Rentals', slug: 'rentals', icon: 'pickaxe', sortOrder: 17 },
  { name: 'Government Assistance', slug: 'government-assistance', icon: 'landmark', sortOrder: 18 },
  { name: 'Emergency Services', slug: 'emergency-services', icon: 'siren', sortOrder: 19 },
];

const services = [
  { name: 'AC Repair', slug: 'ac-repair', icon: 'snowflake', basePrice: 499, cats: ['home-services', 'repair-services', 'appliance-services'] },
  { name: 'Electrician', slug: 'electrician', icon: 'zap', basePrice: 299, cats: ['home-services'] },
  { name: 'Plumbing', slug: 'plumbing', icon: 'droplets', basePrice: 349, cats: ['home-services'] },
  { name: 'Cleaning', slug: 'cleaning', icon: 'sparkles', basePrice: 599, cats: ['cleaning-services'] },
  { name: 'Pest Control', slug: 'pest-control', icon: 'bug', basePrice: 799, cats: ['cleaning-services'] },
  { name: 'Car Wash', slug: 'car-wash', icon: 'car', basePrice: 399, cats: ['vehicle-services'] },
  { name: 'Beauty Services', slug: 'beauty-services', icon: 'sparkle', basePrice: 699, cats: ['beauty-wellness'] },
  { name: 'Bike Repair', slug: 'bike-repair', icon: 'bike', basePrice: 249, cats: ['vehicle-services'] },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: 'washing-machine', basePrice: 449, cats: ['appliance-services'] },
  { name: 'Painting', slug: 'painting', icon: 'paintbrush', basePrice: 1999, cats: ['home-services', 'construction-labor'] },
  { name: 'Carpenter', slug: 'carpenter', icon: 'hammer', basePrice: 499, cats: ['home-services', 'construction-labor'] },
  { name: 'CCTV Installation', slug: 'cctv-installation', icon: 'cctv', basePrice: 999, cats: ['security', 'electronics-services'] },
  { name: 'RO Service', slug: 'ro-service', icon: 'droplet', basePrice: 399, cats: ['appliance-services'] },
  { name: 'Home Shifting', slug: 'home-shifting', icon: 'truck', basePrice: 4999, cats: ['transport-movers'] },
  { name: 'Laptop Repair', slug: 'laptop-repair', icon: 'laptop', basePrice: 599, cats: ['electronics-services'] },
  { name: 'Mobile Repair', slug: 'mobile-repair', icon: 'smartphone', basePrice: 499, cats: ['electronics-services'] },
  { name: 'Home Construction', slug: 'home-construction', icon: 'building2', basePrice: 50000, cats: ['construction-labor'] },
  { name: 'Renovation', slug: 'renovation', icon: 'hard-hat', basePrice: 15000, cats: ['construction-labor'] },
  { name: 'Security Guard', slug: 'security-guard', icon: 'shield', basePrice: 800, cats: ['security'] },
  { name: 'Event Photography', slug: 'event-photography', icon: 'camera', basePrice: 4999, cats: ['events'] },
  { name: 'Packers & Movers', slug: 'packers-movers', icon: 'package', basePrice: 2999, cats: ['transport-movers'] },
  { name: 'Home Tutor', slug: 'home-tutor', icon: 'graduation-cap', basePrice: 399, cats: ['education'] },
  { name: 'Nursing Care', slug: 'nursing-care', icon: 'heart', basePrice: 999, cats: ['healthcare'] },
  { name: 'Website Development', slug: 'website-development', icon: 'monitor', basePrice: 9999, cats: ['digital-services'] },
  { name: 'GST Filing', slug: 'gst-filing', icon: 'file-text', basePrice: 499, cats: ['business-legal'] },
  { name: 'Solar Panel', slug: 'solar-panel', icon: 'sun', basePrice: 25000, cats: ['construction-labor'] },
  { name: 'Gardening', slug: 'gardening', icon: 'tree-pine', basePrice: 399, cats: ['home-services'] },
  { name: 'Generator Rental', slug: 'generator-rental', icon: 'plug', basePrice: 1500, cats: ['rentals'] },
  { name: 'Puncture Repair', slug: 'puncture-repair', icon: 'circle-dot', basePrice: 99, cats: ['vehicle-services'] },
  { name: 'Deep Cleaning', slug: 'deep-cleaning', icon: 'bath', basePrice: 799, cats: ['cleaning-services'] },
  { name: 'Hair Spa', slug: 'hair-spa', icon: 'scissors', basePrice: 599, cats: ['beauty-wellness'] },
  { name: 'Cook / Maid', slug: 'cook-maid', icon: 'chef-hat', basePrice: 499, cats: ['beauty-wellness'] },
  { name: 'PAN Card Service', slug: 'pan-card', icon: 'landmark', basePrice: 199, cats: ['business-legal', 'government-assistance'] },
  { name: 'Emergency Electrician', slug: 'emergency-electrician', icon: 'flame', basePrice: 499, cats: ['emergency-services'] },
  { name: 'JCB Rental', slug: 'jcb-rental', icon: 'pickaxe', basePrice: 3000, cats: ['rentals'] },
  { name: 'Industrial Welding', slug: 'industrial-welding', icon: 'flame', basePrice: 999, cats: ['construction-labor'] },
  { name: 'Smart Home', slug: 'smart-home', icon: 'wifi', basePrice: 4999, cats: ['home-services'] },
  { name: 'Waterproofing', slug: 'waterproofing', icon: 'cloud-rain', basePrice: 1999, cats: ['home-services', 'construction-labor'] },
  { name: 'Interior Design', slug: 'interior-design', icon: 'palette', basePrice: 15000, cats: ['construction-labor'] },
  { name: 'Physiotherapy', slug: 'physiotherapy', icon: 'activity', basePrice: 799, cats: ['healthcare'] },
  { name: 'Digital Marketing', slug: 'digital-marketing', icon: 'trending-up', basePrice: 4999, cats: ['digital-services'] },
  { name: 'Catering Service', slug: 'catering', icon: 'utensils-crossed', basePrice: 2999, cats: ['events'] },
  { name: 'Courier Service', slug: 'courier', icon: 'package', basePrice: 199, cats: ['transport-movers'] },
  { name: 'Wedding Planner', slug: 'wedding-planner', icon: 'party-popper', basePrice: 25000, cats: ['events'] },
  { name: 'Borewell Service', slug: 'borewell', icon: 'droplets', basePrice: 15000, cats: ['agriculture'] },
  { name: 'Scrap Collection', slug: 'scrap-collection', icon: 'recycle', basePrice: 0, cats: ['home-services'] },
  { name: 'Fire Safety', slug: 'fire-safety', icon: 'flame', basePrice: 999, cats: ['security'] },
  { name: 'Architect', slug: 'architect', icon: 'pencil', basePrice: 5000, cats: ['construction-labor'] },
  { name: 'Locksmith', slug: 'locksmith', icon: 'lock', basePrice: 299, cats: ['home-services', 'emergency-services'] },
  { name: 'Water Tank Cleaning', slug: 'water-tank-cleaning', icon: 'droplet', basePrice: 499, cats: ['repair-services', 'cleaning-services'] },
  { name: 'Sofa Cleaning', slug: 'sofa-cleaning', icon: 'sofa', basePrice: 399, cats: ['repair-services', 'cleaning-services'] },
  { name: 'AC Installation', slug: 'ac-installation', icon: 'snowflake', basePrice: 1499, cats: ['appliance-services'] },
  { name: 'Washing Machine Repair', slug: 'washing-machine-repair', icon: 'washing-machine', basePrice: 399, cats: ['appliance-services'] },
  { name: 'Inverter Repair', slug: 'inverter-repair', icon: 'battery', basePrice: 499, cats: ['repair-services'] },
  { name: 'Fan Repair', slug: 'fan-repair', icon: 'fan', basePrice: 199, cats: ['repair-services', 'appliance-services'] },
  { name: 'Computer Repair', slug: 'computer-repair', icon: 'monitor', basePrice: 499, cats: ['electronics-services', 'digital-services'] },
  { name: 'Printer Repair', slug: 'printer-repair', icon: 'printer', basePrice: 349, cats: ['electronics-services'] },
  { name: 'Network Setup', slug: 'network-setup', icon: 'wifi', basePrice: 599, cats: ['electronics-services', 'security', 'digital-services'] },
  { name: 'Pet Care', slug: 'pet-care', icon: 'dog', basePrice: 399, cats: ['home-services'] },
  { name: 'Laundry', slug: 'laundry', icon: 'shirt', basePrice: 199, cats: ['home-services'] },
  { name: 'Content Writer', slug: 'content-writer', icon: 'pen-tool', basePrice: 999, cats: ['digital-services'] },
  { name: 'Legal Advisor', slug: 'legal-advisor', icon: 'scale', basePrice: 999, cats: ['business-legal'] },
  { name: 'Towing Service', slug: 'towing', icon: 'truck', basePrice: 999, cats: ['vehicle-services', 'transport-movers', 'emergency-services'] },
  { name: 'CCTV Repair', slug: 'cctv-repair', icon: 'cctv', basePrice: 399, cats: ['security', 'electronics-services'] },
  { name: 'Glass Repair', slug: 'glass-repair', icon: 'panels-top-left', basePrice: 299, cats: ['home-services'] },
  { name: 'Tile Fixing', slug: 'tile-fixing', icon: 'grid-3x3', basePrice: 1999, cats: ['home-services', 'construction-labor'] },
  { name: 'False Ceiling', slug: 'false-ceiling', icon: 'layers', basePrice: 2499, cats: ['home-services', 'construction-labor'] },
  { name: 'Modular Kitchen', slug: 'modular-kitchen', icon: 'cooking-pot', basePrice: 25000, cats: ['home-services', 'construction-labor'] },
  { name: 'Tractor Rental', slug: 'tractor-rental', icon: 'tractor', basePrice: 2000, cats: ['agriculture', 'rentals'] },
  { name: 'Irrigation Setup', slug: 'irrigation-setup', icon: 'sprout', basePrice: 4999, cats: ['agriculture'] },
];

const seed = async () => {
  await connectDB();
  await Promise.all([
    Category.deleteMany({}),
    Service.deleteMany({}),
    Coupon.deleteMany({}),
    Blog.deleteMany({}),
  ]);

  const createdCats = await Category.insertMany(
    categories.map((c) => ({
      ...c,
      description: `Professional ${c.name} services`,
      isActive: true,
    }))
  );

  const catMap = new Map();
  for (const cat of createdCats) {
    catMap.set(cat.slug, cat._id);
  }

  await Service.insertMany(
    services.map((s) => ({
      ...s,
      category: catMap.get(s.cats[0]),
      shortDescription: `Professional ${s.name} at your doorstep`,
      description: `Book verified ${s.name} professionals with ServDeal.`,
      packages: [
        { name: 'Basic', description: 'Standard service', price: s.basePrice, duration: '1-2 hrs', features: ['Verified pro', '30-day support'] },
        { name: 'Premium', description: 'Extended service', price: Math.round(s.basePrice * 1.5), duration: '2-3 hrs', features: ['Priority booking', 'Premium materials', 'Extended warranty'] },
      ],
      faqs: [
        { question: 'How soon can I get service?', answer: 'Usually within 2-4 hours in metro areas.' },
        { question: 'Are professionals verified?', answer: 'Yes, all providers pass background and skill checks.' },
      ],
      rating: 4.5 + Math.random() * 0.4,
      reviewCount: Math.floor(Math.random() * 500) + 50,
      isActive: true,
    }))
  );

  await Coupon.create({
    code: 'WELCOME100',
    title: 'Welcome Offer',
    description: 'Flat ₹100 off on first booking',
    discountType: 'flat',
    discountValue: 100,
    minOrder: 299,
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });

  await Blog.create({
    title: '5 Tips to Maintain Your AC This Summer',
    slug: 'ac-maintenance-tips',
    excerpt: 'Keep your AC efficient with these expert tips.',
    content: '<p>Regular servicing saves energy and extends AC life...</p>',
    tags: ['ac', 'home'],
    readTime: 5,
    isPublished: true,
  });

  console.log('Seed completed with all categories and services.');
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
