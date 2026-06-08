import * as investmentService from '../services/investmentService.js';
import { requiredAmount } from '../validations/common.js';

export async function invest(req, res) {
  const amount = requiredAmount(req.body.amount);
  const investment = await investmentService.invest(req.user.id, req.params.plan, amount);
  res.status(201).json({
  success: true,
  data: investment
});
}

export async function listInvestments(req, res) {
  const result = await investmentService.listInvestments(req.user.id);
  res.json(result);
}

// Admin endpoint to manually trigger settlement
export async function settleMaturedInvestments(req, res) {
  const settled = await investmentService.settleMaturedInvestments();
  res.json({
    success: true,
    data: {
      settledCount: settled.length,
      message: `Successfully settled ${settled.length} matured investments`
    }
  });
}
