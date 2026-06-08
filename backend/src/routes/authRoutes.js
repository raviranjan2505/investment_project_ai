import express from 'express';
import * as authController from '../controllers/authController.js';
import asyncHandler from '../utils/asyncHandler.js';
import { authLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post('/register', authLimiter, asyncHandler(authController.register));
router.post('/login', authLimiter, asyncHandler(authController.login));

export default router;
