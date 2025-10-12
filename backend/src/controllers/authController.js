import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

export async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });
    return res.json({ token, role: user.role, name: user.name });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

// HQ only: create manager
export async function registerManager(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, dept } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);
    const manager = await User.create({
      name,
      email,
      passwordHash,
      role: 'Manager',
      dept,
      hqAdminId: req.user.id
    });
    return res.status(201).json({ id: manager._id });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}
