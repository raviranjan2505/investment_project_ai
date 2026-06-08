  import * as db from '../database/db.js';
  import * as planRepository from '../repositories/planRepository.js';
  import * as userRepository from '../repositories/userRepository.js';
  import * as investmentRepository from '../repositories/investmentRepository.js';
  import * as transactionRepository from '../repositories/transactionRepository.js';
  import { addPercent, toMoney } from '../utils/money.js';
  import { badRequest, notFound } from '../utils/errors.js';

  export async function invest(userId, planSlug, amount) {
    return db.withTransaction(async (client) => {
      const plan = await planRepository.findBySlug(planSlug, client);
      if (!plan) throw notFound('Investment plan not found');

      const min = Number(plan.min_amount);
      const max = Number(plan.max_amount);
      if (amount < min || amount > max) {
        throw badRequest(`Amount must be between ${min} and ${max}`);
      }

      const balance = await transactionRepository.getWalletBalance(userId, client);
      if (balance < amount) throw badRequest('Insufficient wallet balance');

      const investment = await investmentRepository.create(
        {
          userId,
          planId: plan.id,
          amount,
          returnRate: Number(plan.return_rate),
          durationDays: Number(plan.duration_days),
          expectedReturn: addPercent(amount, plan.return_rate)
        },
        client
      );

      await transactionRepository.create(
        {
          userId,
          type: 'investment',
          amount: -Math.abs(amount),
          status: 'completed',
          referenceType: 'investment',
          referenceId: investment.id,
          metadata: { plan: plan.slug }
        },
        client
      );

      const investor = await userRepository.findAuthById(userId);
      if (investor?.referred_by) {
        const bonus = toMoney((amount * Number(plan.referral_bonus_rate)) / 100);
        if (bonus > 0) {
          await transactionRepository.create(
            {
              userId: investor.referred_by,
              type: 'referral_bonus',
              amount: bonus,
              status: 'completed',
              referenceType: 'investment',
              referenceId: investment.id,
              metadata: { referred_user_id: userId, bonus_rate: plan.referral_bonus_rate }
            },
            client
          );
          await investmentRepository.markReferralPaid(investment.id, client);
        }
      }

      return {
        id: investment.id,
        planId: investment.plan_id,
        planName: plan.name,
        amount: Number(investment.amount),
        returnPercentage: Number(investment.return_rate),
        investedAt: investment.created_at,
        maturityAt: investment.end_date,
        status: investment.status,
        returns: Number(investment.expected_return),
        profit: Number(investment.expected_return),
      };
    });
  }

  export async function listInvestments(userId) {
    const investments = await db.withTransaction(async (client) => {
      await settleMaturedInvestments(client);
      return investmentRepository.listByUser(userId, client);
    });

    return formatInvestments(investments);
  }

  export async function settleMaturedInvestments(client = null) {
    const runSettlement = async (transactionClient) => {
      const matured = await investmentRepository.findMaturedActive(transactionClient);
      const settled = [];

      for (const investment of matured) {
        try {
          const completed = await investmentRepository.markCompleted(investment.id, transactionClient);
          if (!completed) {
            console.warn(`[Settlement] Failed to mark investment ${investment.id} as completed`);
            continue;
          }

          // Credit the return to user's wallet
          const returnAmount = Number(investment.expected_return);
          await transactionRepository.create(
            {
              userId: investment.user_id,
              type: 'return',
              amount: returnAmount,
              status: 'completed',
              referenceType: 'investment',
              referenceId: investment.id,
              metadata: { settled_at: new Date().toISOString() }
            },
            transactionClient
          );
          
          settled.push(completed);
          console.log(`[Settlement] ✅ Investment ${investment.id} settled: +₹${returnAmount} credited`);
        } catch (error) {
          console.error(`[Settlement] ❌ Error settling investment ${investment.id}:`, error);
          throw error;
        }
      }

      return settled;
    };

    if (client) {
      return runSettlement(client);
    }

    return db.withTransaction(runSettlement);
  }

  function formatInvestments(investments) {
    return {
      items: investments.map(inv => ({
        id: inv.id,
        planId: inv.plan_id,
        planName: inv.plan_name,
        amount: Number(inv.amount),
        returnPercentage: Number(inv.return_rate),
        investedAt: inv.created_at,
        maturityAt: inv.end_date,
        status: inv.status,
        returns: Number(inv.expected_return),
        profit: Number(inv.expected_return),
      })),
      total: investments.length,
    };
  }
