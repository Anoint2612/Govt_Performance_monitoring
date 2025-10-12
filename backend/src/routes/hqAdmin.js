import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';
import {
  getAllProjects,
  getInspectionReports,
  getAlerts,
  filterPerformance,
  addManager,
  resolveTicket,
  getEscalatedTickets
} from '../controllers/hqAdminController.js';

const router = Router();

router.use(authenticate, requireRole('HQAdmin'));

router.get('/projects', getAllProjects);
router.get('/inspection-reports', getInspectionReports);
router.get('/alerts', getAlerts);
router.get('/performance', filterPerformance);
router.post('/add-manager', addManager);
router.post('/resolve-ticket/:id', resolveTicket);
router.get('/tickets/escalated', getEscalatedTickets);

export default router;
