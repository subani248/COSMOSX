import { Router } from 'express';
import { fetchNews, fetchNewsById } from '../controllers/newsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, fetchNews);
router.get('/:id', protect, fetchNewsById);

export default router;
