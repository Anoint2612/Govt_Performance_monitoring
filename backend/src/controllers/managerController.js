import Project from '../models/Project.js';
import Assignment from '../models/Assignment.js';
import User from '../models/User.js';
import Alert from '../models/Alert.js';
import Rating from '../models/Rating.js';
import ProjectMember from '../models/ProjectMember.js';

export async function getManagerProjects(req, res) {
  try {
    const projects = await Project.find({ managerId: req.user.id }).populate('managerId', 'name email').lean();
    return res.json(projects);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getManagerEmployees(req, res) {
  try {
    const employees = await User.find({ managerId: req.user.id }).select('name email dept role').lean();
    return res.json(employees);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getManagerAssignments(req, res) {
  try {
    const assignments = await Assignment.find({ assignedBy: req.user.id }).populate('assignedTo', 'name email').lean();
    return res.json(assignments);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function createAssignment(req, res) {
  try {
    const { taskHeading, taskDetails, startTime, endTime, assignedTo } = req.body;
    const a = await Assignment.create({
      taskHeading,
      taskDetails,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      assignedBy: req.user.id,
      assignedTo
    });
    return res.status(201).json({ id: a._id });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function assignEmployeeToProject(req, res) {
  try {
    const { projectId, employeeId } = req.body;
    // validate project belongs to this manager
    const project = await Project.findOne({ _id: projectId, managerId: req.user.id }).lean();
    if (!project) return res.status(403).json({ message: 'Forbidden or project not found' });

    const pm = await ProjectMember.create({ projectId, employeeId, assignedBy: req.user.id });
    return res.status(201).json({ id: pm._id });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: 'Employee already assigned to project' });
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getProjectMembers(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ _id: id, managerId: req.user.id }).lean();
    if (!project) return res.status(403).json({ message: 'Forbidden or project not found' });
    const members = await ProjectMember.find({ projectId: id }).populate('employeeId', 'name email dept').lean();
    return res.json(members);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function postManagerAlert(req, res) {
  try {
    const { type, message, relatedId } = req.body;
    const alert = await Alert.create({ type, message, relatedId });
    return res.status(201).json(alert);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function postRating(req, res) {
  try {
    const { employeeId, score, notes } = req.body;
    const r = await Rating.create({ employeeId, managerId: req.user.id, score, notes });
    return res.status(201).json({ id: r._id });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}
