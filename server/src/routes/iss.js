import { Router } from 'express';
import { fetchISSPosition, fetchISSPositions } from '../controllers/issController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/position', protect, fetchISSPosition);
router.get('/positions', protect, fetchISSPositions);

export default router;
