import Project from '../models/Project.js';
import ProjectReport from '../models/ProjectReport.js';
import Alert from '../models/Alert.js';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

export async function getAllProjects(req, res) {
  try {
    const projects = await Project.find().populate('managerId', 'name email').lean();
    return res.json(projects);
  } catch (e) {
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
