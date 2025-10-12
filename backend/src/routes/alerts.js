import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import Alert from '../models/Alert.js';

const router = Router();

// any authenticated user can read alerts
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).lean();
    return res.json(alerts);
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
