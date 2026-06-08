import express from 'express';
import * as walletController from '../controllers/walletController.js';
import asyncHandler from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/wallet', requireAuth, asyncHandler(walletController.getWallet));
router.get('/transactions', requireAuth, asyncHandler(walletController.getTransactions));
router.get('/payment-status/:paymentId', requireAuth, asyncHandler(walletController.getPaymentStatus));

export default router;
