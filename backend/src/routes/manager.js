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
} from '../controllers/managerController.js';

const router = Router();

router.use(authenticate, requireRole('Manager'));

router.get('/projects', getManagerProjects);
router.get('/employees', getManagerEmployees);
router.get('/assignments', getManagerAssignments);
router.post('/assignments', createAssignment);
router.post('/alerts', postManagerAlert);
router.post('/ratings', postRating);
router.post('/projects/assign', assignEmployeeToProject);
router.get('/projects/:id/members', getProjectMembers);

export default router;
