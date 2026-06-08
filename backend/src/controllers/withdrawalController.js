import * as withdrawalService from '../services/withdrawalService.js';
import { requiredAmount, requiredString } from '../validations/common.js';

export async function requestWithdrawal(req, res) {
  const withdrawal = await withdrawalService.requestWithdrawal({
    userId: req.user.id,
    amount: requiredAmount(req.body.amount),
    method: requiredString(req.body.method, 'method', 80),
    destination: requiredString(req.body.destination, 'destination', 500)
  });
  res.status(201).json({ withdrawal });
}

export async function listWithdrawals(req, res) {
  res.json({ withdrawals: await withdrawalService.listWithdrawals(req.user.id) });
}
