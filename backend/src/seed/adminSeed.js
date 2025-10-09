import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database.js';
import User from '../models/User.js';

async function run() {
  try {
    await connectDatabase();
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@hq.local';
    const name = process.env.SEED_ADMIN_NAME || 'HQ Admin';
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', email);
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      const admin = await User.create({ name, email, passwordHash, role: 'HQAdmin', dept: 'HQ' });
      console.log('Seeded admin with id:', admin._id.toString());
    }
  } catch (e) {
    console.error('Seed error', e);
  } finally {
    await mongoose.connection.close();
  }
}

run();



