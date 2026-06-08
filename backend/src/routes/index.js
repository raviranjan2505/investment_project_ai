import express from 'express';
import authRoutes from './authRoutes.js';
import planRoutes from './planRoutes.js';
import investmentRoutes from './investmentRoutes.js';
import walletRoutes from './walletRoutes.js';
import cryptoRoutes from './cryptoRoutes.js';
import withdrawalRoutes from './withdrawalRoutes.js';
import aiRoutes from './aiRoutes.js';
import * as investmentController from '../controllers/investmentController.js';
import asyncHandler from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/plans', planRoutes);
router.use('/invest', investmentRoutes);
router.get('/investments', requireAuth, asyncHandler(investmentController.listInvestments));
router.use('/', walletRoutes);
router.use('/crypto', cryptoRoutes);
router.use('/', withdrawalRoutes);
router.use('/ai', aiRoutes);

export default router;
