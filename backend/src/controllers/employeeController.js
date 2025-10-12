import Assignment from '../models/Assignment.js';

export async function getEmployeeAssignments(req, res) {
  try {
    const assignments = await Assignment.find({ assignedTo: req.user.id }).populate('assignedBy', 'name email').lean();
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
