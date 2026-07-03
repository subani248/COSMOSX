import { Router } from 'express';
import { getFavorites, addFavorite, removeFavorite, checkFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getFavorites);
router.post('/', protect, addFavorite);
router.delete('/:id', protect, removeFavorite);
router.get('/check/:nasaId', protect, checkFavorite);

export default router;
