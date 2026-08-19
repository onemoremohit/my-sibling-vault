import express from 'express';
import { googleLogin, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/google — Verify Google credential & issue JWT
router.post('/google', googleLogin);

// GET /api/auth/me — Fetch profile of authenticated user
router.get('/me', requireAuth, getMe);

export default router;
