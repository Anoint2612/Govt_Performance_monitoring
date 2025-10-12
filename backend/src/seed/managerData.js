import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Ticket from '../models/Ticket.js';
import Alert from '../models/Alert.js';

async function run() {
  try {
    await connectDatabase();

    // Create a manager
    const managerPassword = await bcrypt.hash('Manager@123', 10);
    const manager = await User.findOneAndUpdate(
      { email: 'manager@test.com' },
      { 
        name: 'Test Manager', 
        email: 'manager@test.com', 
        passwordHash: managerPassword, 
        role: 'Manager', 
        dept: 'Operations' 
      },
      { upsert: true, new: true }
    );

    console.log('Manager created:', manager._id.toString());

    // Create employees under this manager
    const employeePassword = await bcrypt.hash('Employee@123', 10);
    const employee1 = await User.findOneAndUpdate(
      { email: 'employee1@test.com' },
      { 
        name: 'John Doe', 
        email: 'employee1@test.com', 
        passwordHash: employeePassword, 
        role: 'Employee', 
        dept: 'Development',
        managerId: manager._id
      },
      { upsert: true, new: true }
    );

    const employee2 = await User.findOneAndUpdate(
      { email: 'employee2@test.com' },
      { 
        name: 'Jane Smith', 
        email: 'employee2@test.com', 
        passwordHash: employeePassword, 
        role: 'Employee', 
        dept: 'Testing',
        managerId: manager._id
      },
      { upsert: true, new: true }
    );

    console.log('Employees created:', employee1._id.toString(), employee2._id.toString());

    // Create projects for the manager
    const project1 = await Project.findOneAndUpdate(
      { title: 'Test Project 1' },
      {
        projectId: `PRJ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        title: 'Test Project 1',
        details: 'A test project for development',
        budget: 50000,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        managerId: manager._id,
        status: 'Ongoing'
      },
      { upsert: true, new: true }
    );

    const project2 = await Project.findOneAndUpdate(
      { title: 'Test Project 2' },
      {
        projectId: `PRJ-${Date.now() + 1}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        title: 'Test Project 2',
        details: 'Another test project for testing',
        budget: 75000,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        managerId: manager._id,
        status: 'Ongoing'
      },
      { upsert: true, new: true }
    );

    console.log('Projects created:', project1._id.toString(), project2._id.toString());

    // Create some tickets
    const ticket1 = await Ticket.create({
      employeeId: employee1._id,
      heading: 'Bug in login functionality',
      details: 'Users are unable to login with their credentials. Getting 500 error.',
      status: 'Open',
      raisedBy: employee1._id,
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    const ticket2 = await Ticket.create({
      employeeId: employee2._id,
      heading: 'Database connection issue',
      details: 'Database queries are timing out frequently. Need immediate attention.',
      status: 'Open',
      raisedBy: employee2._id,
      startTime: new Date(),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    });

    console.log('Tickets created:', ticket1._id.toString(), ticket2._id.toString());

    // Create some alerts
    const alert1 = await Alert.create({
      projectId: project1._id,
      type: 'Delay',
      message: 'Project deadline approaching. Need to accelerate development.'
    });

    const alert2 = await Alert.create({
      projectId: project2._id,
      type: 'Performance',
      message: 'Team performance metrics below expected levels.'
    });

    console.log('Alerts created:', alert1._id.toString(), alert2._id.toString());

    console.log('Sample data created successfully!');
    console.log('Manager login: manager@test.com / Manager@123');
    console.log('Employee logins: employee1@test.com / Employee@123, employee2@test.com / Employee@123');

  } catch (e) {
    console.error('Seed error:', e);
  } finally {
    await mongoose.connection.close();
  }
}

run();
