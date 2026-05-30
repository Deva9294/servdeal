import 'dotenv/config';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';

const [name, email, phone, password, role = 'superadmin'] = process.argv.slice(2);

if (!name || !email || !phone || !password) {
  console.error(
    'Usage: node src/seed/createUserCredential.js "<name>" "<email>" "<phone>" "<password>" [role]'
  );
  process.exit(1);
}

const allowedRoles = ['superadmin', 'admin', 'provider', 'worker', 'employer', 'customer'];
if (!allowedRoles.includes(role)) {
  console.error(`Invalid role "${role}". Allowed: ${allowedRoles.join(', ')}`);
  process.exit(1);
}

const run = async () => {
  await connectDB();

  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    console.error('User already exists with same email/phone.');
    process.exit(1);
  }

  const referralCode = `SD${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
    isVerified: true,
    referralCode,
  });

  await Wallet.create({ user: user._id });
  console.log(`Created ${role} credential for ${email}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
