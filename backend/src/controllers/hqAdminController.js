import Project from '../models/Project.js';
import ProjectReport from '../models/ProjectReport.js';
import Alert from '../models/Alert.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export async function getAllProjects(req, res) {
  try {
    const projects = await Project.find().populate('managerId', 'name email').lean();
    return res.json(projects);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function createProject(req, res) {
  try {
    const { title, details, budget, deadline, managerId, status = 'Ongoing' } = req.body;

    // Validate required fields
    if (!title || !budget || !deadline || !managerId) {
      return res.status(400).json({ message: 'Missing required fields: title, budget, deadline, managerId' });
    }

    // Validate manager exists
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== 'Manager') {
      return res.status(400).json({ message: 'Invalid manager ID' });
    }

    // Generate unique project ID
    const projectId = `PRJ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const project = await Project.create({
      projectId,
      title,
      details,
      budget: Number(budget),
      deadline: new Date(deadline),
      managerId,
      status
    });

    // Populate manager info for response
    await project.populate('managerId', 'name email');

    return res.status(201).json(project);
  } catch (e) {
    console.error('Create project error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getInspectionReports(req, res) {
  try {
    const reports = await ProjectReport.find().populate('projectId', 'title').lean();
    return res.json(reports);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getAlerts(req, res) {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).lean();
    return res.json(alerts);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function filterPerformance(req, res) {
  try {
    const { minScore = 0, maxScore = 100 } = req.query;
    // For MVP, return managers and employees filtered by department and score stub
    const users = await User.find({ role: 'Employee' }).select('name dept level').lean();
    return res.json({ criteria: { minScore, maxScore }, employees: users });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function addManager(req, res) {
  // Delegate to auth registerManager in routes, kept for completeness
  return res.status(405).json({ message: 'Use /auth/register-manager' });
}

export async function resolveTicket(req, res) {
  try {
    const { id } = req.params;
    const updated = await Ticket.findByIdAndUpdate(
      id,
      { status: 'Resolved' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    return res.json(updated);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getEscalatedTickets(req, res) {
  try {
    const tickets = await Ticket.find({ status: 'Escalated' }).lean();
    return res.json(tickets);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getManagers(req, res) {
  try {
    const managers = await User.find({ role: 'Manager' }).select('name email dept').lean();
    return res.json(managers);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getManagersWithProjects(req, res) {
  try {
    // First get all managers
    const managers = await User.find({ role: 'Manager' })
      .select('name email dept createdAt')
      .lean();

    // Get projects for each manager and calculate stats
    const managersWithProjects = await Promise.all(
      managers.map(async (manager) => {
        // Ensure proper ObjectId conversion
        const managerObjectId = new mongoose.Types.ObjectId(manager._id);
        const projects = await Project.find({ managerId: managerObjectId })
          .select('title status deadline budget createdAt')
          .sort({ createdAt: -1 })
          .lean();
        
        return {
          ...manager,
          projects,
          projectCount: projects.length,
          activeProjects: projects.filter(p => p.status === 'Ongoing').length,
          completedProjects: projects.filter(p => p.status === 'Completed').length,
          delayedProjects: projects.filter(p => p.status === 'Delayed').length
        };
      })
    );

    return res.json(managersWithProjects);
  } catch (e) {
    console.error('Get managers with projects error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
}
