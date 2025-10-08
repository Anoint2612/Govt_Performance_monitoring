const mongoose = require("mongoose");
require("dotenv").config();

const Manager = require("./models/Manager");
const Employee = require("./models/Employee");
const Project = require("./models/Project");
const InspectionReport = require("./models/InspectionReport");
const Alert = require("./models/Alert");
const Ticket = require("./models/Ticket");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Clear existing data
  await Manager.deleteMany({});
  await Employee.deleteMany({});
  await Project.deleteMany({});
  await InspectionReport.deleteMany({});
  await Alert.deleteMany({});
  await Ticket.deleteMany({});

  // Create managers
  const manager1 = await Manager.create({
    name: "Alice Johnson",
    email: "alice@hq.com",
  });
  const manager2 = await Manager.create({
    name: "Bob Smith",
    email: "bob@hq.com",
  });

  // Create employees
  const employee1 = await Employee.create({
    name: "John Doe",
    email: "john@company.com",
    performance: 85,
  });
  const employee2 = await Employee.create({
    name: "Jane Roe",
    email: "jane@company.com",
    performance: 35,
  });
  const employee3 = await Employee.create({
    name: "Sam Lee",
    email: "sam@company.com",
    performance: 60,
  });

  // Create projects
  const project1 = await Project.create({
    title: "Bridge Construction",
    manager: manager1._id,
    status: "In Progress",
    employees: [employee1._id, employee2._id],
    targets: [
      { name: "Foundation", dueDate: new Date("2025-10-15"), completed: true },
      { name: "Pillars", dueDate: new Date("2025-11-01"), completed: false },
    ],
  });
  const project2 = await Project.create({
    title: "Road Expansion",
    manager: manager2._id,
    status: "Delayed",
    employees: [employee3._id],
    targets: [
      { name: "Survey", dueDate: new Date("2025-09-30"), completed: true },
      { name: "Paving", dueDate: new Date("2025-10-20"), completed: false },
    ],
  });

  // Create inspection reports
  await InspectionReport.create({
    project: project1._id,
    report: "Foundation completed. Pillars in progress.",
  });
  await InspectionReport.create({
    project: project2._id,
    report: "Survey done. Paving delayed due to weather.",
  });

  // Create alerts
  await Alert.create({
    project: project2._id,
    type: "Delay",
    message: "Project delayed due to weather.",
  });
  await Alert.create({
    project: project1._id,
    type: "Missed Target",
    message: "Pillars target missed.",
  });

  // Create tickets
  await Ticket.create({
    project: project2._id,
    description: "Extreme delay reported.",
    status: "Open",
  });
  await Ticket.create({
    project: project1._id,
    description: "Quality issue in foundation.",
    status: "Resolved",
  });

  console.log("Dummy data seeded!");
  mongoose.disconnect();
}

seed();
