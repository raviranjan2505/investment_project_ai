import express from 'express';
import * as aiController from '../controllers/aiController.js';
import asyncHandler from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { sensitiveLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/chat', requireAuth, sensitiveLimiter, asyncHandler(aiController.chat));
router.post('/fraud-check', requireAuth, sensitiveLimiter, asyncHandler(aiController.fraudCheck));
router.get('/suggest-plan', requireAuth, sensitiveLimiter, asyncHandler(aiController.suggestPlan));

export default router;
