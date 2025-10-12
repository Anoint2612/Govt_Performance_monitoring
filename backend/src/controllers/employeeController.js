import Assignment from '../models/Assignment.js';
import ProjectMember from '../models/ProjectMember.js';
import Project from '../models/Project.js';
import Alert from '../models/Alert.js';
import Ticket from '../models/Ticket.js';

export async function getEmployeeAssignments(req, res) {
  try {
    // fetch as documents so we can update statuses if past endTime
    // Exclude assignments that have been Verified by the manager
    const assignments = await Assignment.find({ assignedTo: req.user.id, status: { $ne: 'Verified' } })
      .populate('assignedBy', 'name email')
      .populate('projectId', 'title managerId')
    ;

    const now = new Date();
    for (const a of assignments) {
      if (a.status === 'Pending' && a.endTime && a.endTime < now) {
        a.status = 'Delayed';
        // save each changed assignment
        // don't await inside loop to keep it simple but ensure it's saved
        // we will await sequentially to avoid race conditions
        await a.save();
      }
    }

    return res.json(assignments);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function postAssignmentUpdate(req, res) {
  try {
    const { id } = req.params;
    const { text, status } = req.body;
    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    // ensure assignedTo matches
    if (assignment.assignedTo.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    if (text) {
      assignment.updates = assignment.updates || [];
      assignment.updates.push({ by: req.user.id, text, createdAt: new Date() });
    }
    if (status) assignment.status = status;
    await assignment.save();
    return res.json(assignment);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getEmployeeProjects(req, res) {
  try {
    const memberships = await ProjectMember.find({ employeeId: req.user.id }).lean();
    const projectIds = memberships.map(m => m.projectId);
    const projects = await Project.find({ _id: { $in: projectIds } }).populate('managerId', 'name email').lean();
    return res.json(projects);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getEmployeeAlerts(req, res) {
  try {
    const memberships = await ProjectMember.find({ employeeId: req.user.id }).lean();
    const projectIds = memberships.map(m => m.projectId);
    const alerts = await Alert.find({ projectId: { $in: projectIds } }).sort({ createdAt: -1 }).lean();
    return res.json(alerts);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function postAssignmentTicket(req, res) {
  try {
    const { id } = req.params; // assignment id
    const { heading, details } = req.body;
    const assignment = await Assignment.findById(id).populate('projectId');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (assignment.assignedTo.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    // escalate to project manager if possible
    const managerId = assignment.projectId?.managerId;

    const ticket = await Ticket.create({ employeeId: req.user.id, heading, details, escalatedTo: managerId });
    return res.status(201).json({ id: ticket._id });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getEmployeeAssignmentHistory(req, res) {
  try {
    const assignments = await Assignment.find({ assignedTo: req.user.id, status: 'Verified' })
      .populate('assignedBy', 'name email')
      .populate('projectId', 'title managerId')
      .sort({ updatedAt: -1 })
      .lean();

    return res.json(assignments);
  } catch (e) {
    console.error('Get assignment history error:', e);
    return res.status(500).json({ message: 'Server error' });
  }
}
