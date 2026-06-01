import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import Coupon from '../models/Coupon.js';
import Blog from '../models/Blog.js';

const services = [
  { name: 'AC Repair', slug: 'ac-repair', icon: 'snowflake', basePrice: 499 },
  { name: 'Electrician', slug: 'electrician', icon: 'zap', basePrice: 299 },
  { name: 'Plumbing', slug: 'plumbing', icon: 'droplets', basePrice: 349 },
  { name: 'Cleaning', slug: 'cleaning', icon: 'sparkles', basePrice: 599 },
  { name: 'Pest Control', slug: 'pest-control', icon: 'bug', basePrice: 799 },
  { name: 'Car Wash', slug: 'car-wash', icon: 'car', basePrice: 399 },
  { name: 'Beauty Services', slug: 'beauty-services', icon: 'sparkle', basePrice: 699 },
  { name: 'Bike Repair', slug: 'bike-repair', icon: 'bike', basePrice: 249 },
  { name: 'Appliance Repair', slug: 'appliance-repair', icon: 'washing-machine', basePrice: 449 },
  { name: 'Painting', slug: 'painting', icon: 'paintbrush', basePrice: 1999 },
  { name: 'Carpenter', slug: 'carpenter', icon: 'hammer', basePrice: 499 },
  { name: 'CCTV Installation', slug: 'cctv-installation', icon: 'cctv', basePrice: 999 },
  { name: 'RO Service', slug: 'ro-service', icon: 'droplet', basePrice: 399 },
  { name: 'Home Shifting', slug: 'home-shifting', icon: 'truck', basePrice: 4999 },
  { name: 'Laptop Repair', slug: 'laptop-repair', icon: 'laptop', basePrice: 599 },
  { name: 'Mobile Repair', slug: 'mobile-repair', icon: 'smartphone', basePrice: 499 },
  { name: 'Home Construction', slug: 'home-construction', icon: 'building2', basePrice: 50000 },
  { name: 'Renovation', slug: 'renovation', icon: 'hard-hat', basePrice: 15000 },
  { name: 'Security Guard', slug: 'security-guard', icon: 'shield', basePrice: 800 },
  { name: 'Event Photography', slug: 'event-photography', icon: 'camera', basePrice: 4999 },
  { name: 'Packers & Movers', slug: 'packers-movers', icon: 'package', basePrice: 2999 },
  { name: 'Home Tutor', slug: 'home-tutor', icon: 'graduation-cap', basePrice: 399 },
  { name: 'Nursing Care', slug: 'nursing-care', icon: 'heart', basePrice: 999 },
  { name: 'Website Development', slug: 'website-development', icon: 'monitor', basePrice: 9999 },
  { name: 'GST Filing', slug: 'gst-filing', icon: 'file-text', basePrice: 499 },
  { name: 'Solar Panel', slug: 'solar-panel', icon: 'sun', basePrice: 25000 },
  { name: 'Gardening', slug: 'gardening', icon: 'tree-pine', basePrice: 399 },
  { name: 'Generator Rental', slug: 'generator-rental', icon: 'plug', basePrice: 1500 },
  { name: 'Puncture Repair', slug: 'puncture-repair', icon: 'circle-dot', basePrice: 99 },
  { name: 'Deep Cleaning', slug: 'deep-cleaning', icon: 'bath', basePrice: 799 },
  { name: 'Hair Spa', slug: 'hair-spa', icon: 'scissors', basePrice: 599 },
  { name: 'Cook / Maid', slug: 'cook-maid', icon: 'chef-hat', basePrice: 499 },
  { name: 'PAN Card Service', slug: 'pan-card', icon: 'landmark', basePrice: 199 },
  { name: 'Emergency Electrician', slug: 'emergency-electrician', icon: 'flame', basePrice: 499 },
  { name: 'JCB Rental', slug: 'jcb-rental', icon: 'pickaxe', basePrice: 3000 },
  { name: 'Industrial Welding', slug: 'industrial-welding', icon: 'flame', basePrice: 999 },
  { name: 'Smart Home', slug: 'smart-home', icon: 'wifi', basePrice: 4999 },
  { name: 'Waterproofing', slug: 'waterproofing', icon: 'cloud-rain', basePrice: 1999 },
  { name: 'Interior Design', slug: 'interior-design', icon: 'palette', basePrice: 15000 },
  { name: 'Physiotherapy', slug: 'physiotherapy', icon: 'activity', basePrice: 799 },
  { name: 'Digital Marketing', slug: 'digital-marketing', icon: 'trending-up', basePrice: 4999 },
  { name: 'Catering Service', slug: 'catering', icon: 'utensils-crossed', basePrice: 2999 },
  { name: 'Courier Service', slug: 'courier', icon: 'package', basePrice: 199 },
  { name: 'Wedding Planner', slug: 'wedding-planner', icon: 'party-popper', basePrice: 25000 },
  { name: 'Borewell Service', slug: 'borewell', icon: 'droplets', basePrice: 15000 },
  { name: 'Scrap Collection', slug: 'scrap-collection', icon: 'recycle', basePrice: 0 },
  { name: 'Fire Safety', slug: 'fire-safety', icon: 'flame', basePrice: 999 },
  { name: 'Architect', slug: 'architect', icon: 'pencil', basePrice: 5000 },
  { name: 'Locksmith', slug: 'locksmith', icon: 'lock', basePrice: 299 },
  { name: 'Water Tank Cleaning', slug: 'water-tank-cleaning', icon: 'droplet', basePrice: 499 },
  { name: 'Sofa Cleaning', slug: 'sofa-cleaning', icon: 'sofa', basePrice: 399 },
  { name: 'AC Installation', slug: 'ac-installation', icon: 'snowflake', basePrice: 1499 },
  { name: 'Washing Machine Repair', slug: 'washing-machine-repair', icon: 'washing-machine', basePrice: 399 },
  { name: 'Inverter Repair', slug: 'inverter-repair', icon: 'battery', basePrice: 499 },
  { name: 'Fan Repair', slug: 'fan-repair', icon: 'fan', basePrice: 199 },
  { name: 'Computer Repair', slug: 'computer-repair', icon: 'monitor', basePrice: 499 },
  { name: 'Printer Repair', slug: 'printer-repair', icon: 'printer', basePrice: 349 },
  { name: 'Network Setup', slug: 'network-setup', icon: 'wifi', basePrice: 599 },
  { name: 'Pet Care', slug: 'pet-care', icon: 'dog', basePrice: 399 },
  { name: 'Laundry', slug: 'laundry', icon: 'shirt', basePrice: 199 },
  { name: 'Content Writer', slug: 'content-writer', icon: 'pen-tool', basePrice: 999 },
  { name: 'Legal Advisor', slug: 'legal-advisor', icon: 'scale', basePrice: 999 },
  { name: 'Towing Service', slug: 'towing', icon: 'truck', basePrice: 999 },
  { name: 'CCTV Repair', slug: 'cctv-repair', icon: 'cctv', basePrice: 399 },
  { name: 'Glass Repair', slug: 'glass-repair', icon: 'panels-top-left', basePrice: 299 },
  { name: 'Tile Fixing', slug: 'tile-fixing', icon: 'grid-3x3', basePrice: 1999 },
  { name: 'False Ceiling', slug: 'false-ceiling', icon: 'layers', basePrice: 2499 },
  { name: 'Modular Kitchen', slug: 'modular-kitchen', icon: 'cooking-pot', basePrice: 25000 },
  { name: 'Tractor Rental', slug: 'tractor-rental', icon: 'tractor', basePrice: 2000 },
  { name: 'Irrigation Setup', slug: 'irrigation-setup', icon: 'sprout', basePrice: 4999 },
];

const seed = async () => {
  await connectDB();
  await Promise.all([
    Category.deleteMany({}),
    Service.deleteMany({}),
    Coupon.deleteMany({}),
    Blog.deleteMany({}),
  ]);

  const category = await Category.create({
    name: 'Home Services',
    slug: 'home-services',
    description: 'All home and daily services',
    icon: 'home',
    sortOrder: 1,
  });

  await Service.insertMany(
    services.map((s) => ({
      ...s,
      category: category._id,
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

  console.log('Seed completed. No default login users were created.');
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
