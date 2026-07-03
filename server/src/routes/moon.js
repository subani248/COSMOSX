import { Router } from 'express';
import { fetchMoonPhase } from '../controllers/moonController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/phase', protect, fetchMoonPhase);

export default router;
