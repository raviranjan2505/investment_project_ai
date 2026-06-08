import * as transactionRepository from '../repositories/transactionRepository.js';
import * as investmentRepository from '../repositories/investmentRepository.js';
import * as db from '../database/db.js';

export async function getWallet(userId) {
  const [balance, stats, userResult] = await Promise.all([
    transactionRepository.getWalletBalance(userId),
    getWalletStats(userId),
    db.query(
      `SELECT referral_code
       FROM users
       WHERE id = $1`,
      [userId]
    ),
  ]);

  return {
    balance,
    availableBalance: balance,
    totalInvested: stats.totalInvested,
    totalReturns: stats.totalReturns,
    remainingInvestment: stats.remainingInvestment,
    referralIncome: stats.referralIncome,
    referralCode: userResult.rows[0]?.referral_code || null,
  };
}

export async function getWalletStats(userId) {
  // Get total invested amount
  const investmentResult = await db.query(
    `SELECT COALESCE(SUM(amount), 0)::numeric(18,2) AS total
     FROM investments
     WHERE user_id = $1 AND status != 'cancelled'`,
    [userId]
  );

  const totalInvested = Number(investmentResult.rows[0].total);

    // active (not matured yet)
  const activeResult = await db.query(
    `SELECT COALESCE(SUM(amount), 0)::numeric(18,2) AS total
     FROM investments
     WHERE user_id = $1 AND status = 'active'`,
    [userId]
  );
  const remainingInvestment = Number(activeResult.rows[0].total);

  // Get total returns from completed investments
  const returnsResult = await db.query(
    `SELECT COALESCE(SUM(expected_return), 0)::numeric(18,2) AS total
     FROM investments
     WHERE user_id = $1 AND status = 'completed'`,
    [userId]
  );

  const totalReturns = Number(returnsResult.rows[0].total);

  const referralResult = await db.query(
    `SELECT COALESCE(SUM(amount), 0)::numeric(18,2) AS total
     FROM transactions
     WHERE user_id = $1 AND type = 'referral_bonus' AND status = 'completed'`,
    [userId]
  );

  const referralIncome = Number(referralResult.rows[0].total);

  return {
    totalInvested,
    remainingInvestment,
    totalReturns,
    referralIncome,
  };
}

export async function getTransactions(userId, limit = 50, offset = 0) {
  const result = await db.query(
    `SELECT 
      id, 
      type, 
      amount, 
      status, 
      metadata,
      created_at AS "createdAt"
     FROM transactions
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  const countResult = await db.query(
    `SELECT COUNT(*) as count
     FROM transactions
     WHERE user_id = $1`,
    [userId]
  );

  return {
    items: result.rows.map(tx => ({
      ...tx,
      description: getTransactionDescription(tx.type, tx.metadata),
    })),
    total: Number(countResult.rows[0].count),
  };
}

export async function getPaymentStatus(userId, paymentId) {
  const result = await db.query(
    `SELECT cp.*, t.status as transaction_status
     FROM crypto_payments cp
     LEFT JOIN transactions t ON t.id = cp.transaction_id
     WHERE cp.user_id = $1 AND cp.payment_id = $2`,
    [userId, paymentId]
  );
  return result.rows[0] || null;
}

function getTransactionDescription(type, metadata = {}) {
  const descriptions = {
    deposit: 'Wallet Deposit',
    investment: 'Investment Purchase',
    return: 'Investment Return',
    referral_bonus: 'Referral Bonus',
    withdrawal: 'Withdrawal',
    crypto_payment: `${metadata?.pay_currency?.toUpperCase() || 'Crypto'} Payment`,
  };
  return descriptions[type] || 'Transaction';
}
