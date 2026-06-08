import express from 'express';
import * as planController from '../controllers/planController.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(planController.getPlans));

export default router;
