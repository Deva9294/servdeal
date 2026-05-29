import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import Coupon from '../models/Coupon.js';
import Blog from '../models/Blog.js';
import Wallet from '../models/Wallet.js';

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
];

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Service.deleteMany({}),
    Coupon.deleteMany({}),
    Blog.deleteMany({}),
    Wallet.deleteMany({}),
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

  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@servdeal.com',
    phone: '9999999999',
    password: 'Admin@123',
    role: 'superadmin',
    isVerified: true,
    city: 'Patna',
    referralCode: 'SDADMIN',
  });
  await Wallet.create({ user: admin._id, balance: 0 });

  await User.create({
    name: 'Demo Customer',
    email: 'customer@servdeal.com',
    phone: '8888888888',
    password: 'Customer@123',
    role: 'customer',
    isVerified: true,
    city: 'Patna',
    walletBalance: 1250,
    referralCode: 'SDCUST1',
  });

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
    author: admin._id,
    tags: ['ac', 'home'],
    readTime: 5,
    isPublished: true,
  });

  console.log('Seed completed. Admin: admin@servdeal.com / Admin@123');
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
