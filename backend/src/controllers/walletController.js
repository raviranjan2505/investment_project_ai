import * as walletService from '../services/walletService.js';
import { badRequest } from '../utils/errors.js';

export async function getWallet(req, res) {
  const wallet = await walletService.getWallet(req.user.id);
  res.json(wallet);
}

export async function getTransactions(req, res) {
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  const offset = parseInt(req.query.offset) || 0;

  const transactions = await walletService.getTransactions(req.user.id, limit, offset);
  res.json(transactions);
}

export async function getPaymentStatus(req, res) {
  const { paymentId } = req.params;

  if (!paymentId) {
    throw badRequest('paymentId is required');
  }

  const payment = await walletService.getPaymentStatus(req.user.id, paymentId);

  if (!payment) {
    throw badRequest('Payment not found');
  }

  res.json(payment);
}
