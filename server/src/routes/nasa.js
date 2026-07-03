import { Router } from 'express';
import { fetchAPOD, fetchMarsPhotos, fetchAsteroids, fetchEarthImagery, fetchNasaSearch } from '../controllers/nasaController.js';
import { protect } from '../middleware/auth.js';
import { nasaLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/apod', protect, nasaLimiter, fetchAPOD);
router.get('/mars-photos', protect, nasaLimiter, fetchMarsPhotos);
router.get('/asteroids', protect, nasaLimiter, fetchAsteroids);
router.get('/earth-imagery', protect, nasaLimiter, fetchEarthImagery);
router.get('/search', protect, nasaLimiter, fetchNasaSearch);

export default router;
