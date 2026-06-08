import * as cryptoService from '../services/cryptoService.js';
import { requiredAmount, requiredString } from '../validations/common.js';
import { badRequest } from '../utils/errors.js';

export async function createPayment(req, res) {
  const result = await cryptoService.createPayment({
    userId: req.user.id,
    amount: requiredAmount(req.body.amount),
    payCurrency: requiredString(req.body.pay_currency, 'pay_currency', 20).toLowerCase()
  });
  res.status(201).json(result);
}

export async function getPaymentStatus(req, res) {
  const { paymentId } = req.params;

  if (!paymentId) {
    throw badRequest('paymentId is required');
  }

  const payment = await cryptoService.getPaymentStatus(req.user.id, paymentId);

  if (!payment) {
    throw badRequest('Payment not found');
  }

  res.json(payment);
}

export async function recordDeposit(req, res) {
  const result = await cryptoService.recordDirectDeposit({
    userId: req.user.id,
    amount: requiredAmount(req.body.amount),
    description: req.body.description || 'Direct Deposit',
    metadata: req.body.metadata || {}
  });

  res.status(201).json(result);
}

export async function webhook(req, res) {
  const result = await cryptoService.handleWebhook(req.rawBody, req.headers, req.body);
  res.json(result);
}
