import * as aiService from '../services/aiService.js';
import { requiredString } from '../validations/common.js';

export async function chat(req, res) {
  const result = await aiService.chat({
    user: req.user,
    message: requiredString(req.body.message, 'message', 4000)
  });
  res.json(result);
}

export async function fraudCheck(req, res) {
  const result = await aiService.fraudCheck({
    user: req.user,
    activity: req.body.activity || {}
  });
  res.json(result);
}

export async function suggestPlan(req, res) {
  res.json(await aiService.suggestInvestmentPlan(req.user));
}
