import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';
import { getEmployeeAssignments, postAssignmentUpdate, getEmployeeProjects, getEmployeeAlerts, postAssignmentTicket } from '../controllers/employeeController.js';

const router = Router();

router.use(authenticate, requireRole('Employee'));

router.get('/assignments', getEmployeeAssignments);
router.post('/assignments/:id/update', postAssignmentUpdate);
router.get('/projects', getEmployeeProjects);
router.get('/alerts', getEmployeeAlerts);
router.post('/assignments/:id/ticket', postAssignmentTicket);

export default router;
