import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';
import {
  getManagerProjects,
  getManagerEmployees,
  getManagerAssignments,
  postManagerAlert,
  postRating,
  createAssignment,
  assignEmployeeToProject,
  getProjectMembers,
  getManagerTickets,
  resolveTicket,
  escalateTicket,
} from '../controllers/managerController.js';

const router = Router();

router.use(authenticate, requireRole('Manager'));

router.get('/projects', getManagerProjects);
router.get('/employees', getManagerEmployees);
router.get('/assignments', getManagerAssignments);
router.get('/tickets', getManagerTickets);
router.post('/assignments', createAssignment);
router.post('/alerts', postManagerAlert);
router.post('/ratings', postRating);
router.post('/projects/assign', assignEmployeeToProject);
router.post('/tickets/:id/resolved', resolveTicket);
router.post('/tickets/:id/escalated', escalateTicket);
router.get('/projects/:id/members', getProjectMembers);

export default router;
