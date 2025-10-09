import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import { connectDatabase } from '../src/config/database.js';

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@hq.local';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const name = process.env.ADMIN_NAME || 'HQ Admin';

  await connectDatabase();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', existing._id.toString());
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await User.create({
    name,
    email,
    passwordHash,
    role: 'HQAdmin',
    dept: 'HQ'
  });
  console.log('Admin created with id:', admin._id.toString());
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});



