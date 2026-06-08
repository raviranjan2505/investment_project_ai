import express from 'express';
import * as investmentController from '../controllers/investmentController.js';
import asyncHandler from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { sensitiveLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();
const allowedPlans = new Set(['basic', 'silver', 'gold', 'platinum']);

router.post('/:plan', requireAuth, sensitiveLimiter, (req, res, next) => {
  if (!allowedPlans.has(req.params.plan)) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Investment plan route not found' } });
  }
  return next();
}, asyncHandler(investmentController.invest));

router.get('/', requireAuth, asyncHandler(investmentController.listInvestments));

// Admin endpoint to manually settle matured investments (for testing and manual correction)
router.post('/admin/settle-matured', requireAuth, asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Admin access required' } });
  }
  return next();
}), asyncHandler(investmentController.settleMaturedInvestments));

export default router;
