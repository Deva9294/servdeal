import 'dotenv/config';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';

const run = async () => {
  await connectDB();
  const email = process.env.TEST_USER_EMAIL || 'test@servdeal.local';
  const phone = process.env.TEST_USER_PHONE || '9000000000';
  const password = process.env.TEST_USER_PASSWORD || 'password123';
  const name = process.env.TEST_USER_NAME || 'Test User';

  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    console.log('Test user already exists');
    process.exit(0);
  }

  const user = await User.create({ name, email, phone, password, role: 'customer', isVerified: true });
  await Wallet.create({ user: user._id });
  console.log('Created test user:', email, 'password:', password);
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
