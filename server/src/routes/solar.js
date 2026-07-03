import { Router } from 'express';
import { fetchSolarFlares, fetchCMEs, fetchGSTs } from '../controllers/solarController.js';
import { protect } from '../middleware/auth.js';
import { nasaLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/flares', protect, nasaLimiter, fetchSolarFlares);
router.get('/cmes', protect, nasaLimiter, fetchCMEs);
router.get('/gsts', protect, nasaLimiter, fetchGSTs);

export default router;
