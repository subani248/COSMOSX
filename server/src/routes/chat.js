import { Router } from 'express';
import { sendMessage, explainImage, getChatHistory, getSessions } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/message', protect, sendMessage);
router.post('/explain', protect, explainImage);
router.get('/history/:sessionId', protect, getChatHistory);
router.get('/sessions', protect, getSessions);

export default router;
