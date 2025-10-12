import { Router } from 'express';
import { body } from 'express-validator';
import { login, registerManager, registerEmployee, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = Router();

router.post(
  '/login',
  body('email').isEmail({ require_tld: false }),
  body('password').isString().isLength({ min: 6 }),
  login
);

router.post(
  '/register-manager',
  authenticate,
  requireRole('HQAdmin'),
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  registerManager
);

router.post(
  '/register-employee',
  authenticate,
  requireRole('Manager'),
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  registerEmployee
);

router.get('/me', authenticate, me);

export default router;
