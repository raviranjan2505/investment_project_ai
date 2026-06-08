import express from 'express';
import * as withdrawalController from '../controllers/withdrawalController.js';
import asyncHandler from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { sensitiveLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/withdraw', requireAuth, sensitiveLimiter, asyncHandler(withdrawalController.requestWithdrawal));
router.get('/withdrawals', requireAuth, asyncHandler(withdrawalController.listWithdrawals));

export default router;
