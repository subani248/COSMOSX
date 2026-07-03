import { Router } from 'express';
import { getEntries, createEntry, updateEntry, deleteEntry, searchEntries } from '../controllers/journalController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getEntries);
router.post('/', protect, createEntry);
router.put('/:id', protect, updateEntry);
router.delete('/:id', protect, deleteEntry);
router.get('/search', protect, searchEntries);

export default router;
