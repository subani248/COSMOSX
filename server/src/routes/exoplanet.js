import { Router } from 'express';
import { fetchExoplanets } from '../controllers/exoplanetController.js';
import { protect } from '../middleware/auth.js';
import { nasaLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/', protect, nasaLimiter, fetchExoplanets);

export default router;
