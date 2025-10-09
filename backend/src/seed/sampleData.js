import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDatabase } from '../config/database.js'
import User from '../models/User.js'
import Project from '../models/Project.js'
import Alert from '../models/Alert.js'

async function run() {
  try {
    await connectDatabase()

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@hq.local'
    const admin = await User.findOne({ email: adminEmail }).lean()
    if (!admin) {
      console.log('Admin not found, run seed:admin first')
      return
    }

    const manager = await User.findOneAndUpdate(
      { email: 'manager1@hq.local' },
      { $setOnInsert: { name: 'Manager One', email: 'manager1@hq.local', passwordHash: admin.passwordHash, role: 'Manager', dept: 'Ops', hqAdminId: admin._id } },
      { upsert: true, new: true }
    )

    const p1 = await Project.create({
      title: 'Bridge Renovation',
      details: 'Structural reinforcement and resurfacing',
      budget: 1200000,
      deadline: new Date(Date.now() + 1000*60*60*24*90),
      managerId: manager._id,
      status: 'Ongoing'
    })

    const p2 = await Project.create({
      title: 'New Office Buildout',
      details: 'HQ floor 10 fit-out',
      budget: 450000,
      deadline: new Date(Date.now() + 1000*60*60*24*60),
      managerId: manager._id,
      status: 'Delayed'
    })

    await Alert.create([
      { type: 'Delay', message: 'Project delay reported on New Office Buildout', relatedId: p2._id },
      { type: 'Performance', message: 'Employee performance dropped in Ops department' }
    ])

    console.log('Sample projects and alerts created:', p1._id.toString(), p2._id.toString())
  } catch (e) {
    console.error('Seed sample data error', e)
  } finally {
    await mongoose.connection.close()
  }
}

run()


