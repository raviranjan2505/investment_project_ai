import express from 'express';
import * as cryptoController from '../controllers/cryptoController.js';
import asyncHandler from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { sensitiveLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/create-payment', requireAuth, sensitiveLimiter, asyncHandler(cryptoController.createPayment));
router.get('/payment-status/:paymentId', requireAuth, asyncHandler(cryptoController.getPaymentStatus));
router.post('/record-deposit', requireAuth, requireAdmin, sensitiveLimiter, asyncHandler(cryptoController.recordDeposit));
router.post('/webhook', sensitiveLimiter, asyncHandler(cryptoController.webhook));

export default router;
