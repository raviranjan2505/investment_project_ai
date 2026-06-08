import * as db from '../database/db.js';
import * as transactionRepository from '../repositories/transactionRepository.js';
import * as withdrawalRepository from '../repositories/withdrawalRepository.js';
import { badRequest } from '../utils/errors.js';

export async function requestWithdrawal({ userId, amount, method, destination }) {
  return db.withTransaction(async (client) => {
    const balance = await transactionRepository.getWalletBalance(userId, client);
    if (balance < amount) throw badRequest('Insufficient wallet balance');

    const transaction = await transactionRepository.create(
      {
        userId,
        type: 'withdrawal',
        amount: -Math.abs(amount),
        status: 'completed',
        referenceType: 'withdrawal_request',
        metadata: { method, destination }
      },
      client
    );

    const withdrawal = await withdrawalRepository.create(
      { userId, amount, method, destination, transactionId: transaction.id },
      client
    );

    return withdrawal;
  });
}

export async function listWithdrawals(userId) {
  return withdrawalRepository.listByUser(userId);
}
