import { supportChat } from '../ai/chatbot.js';
import { detectFraud } from '../ai/fraudDetection.js';
import { suggestPlan } from '../ai/planSuggestion.js';
import * as planRepository from '../repositories/planRepository.js';
import * as transactionRepository from '../repositories/transactionRepository.js';

export async function chat({ user, message }) {
  const reply = await supportChat({ user, message });
  return { reply };
}

export async function fraudCheck({ user, activity }) {
  return detectFraud({ user, activity });
}

export async function suggestInvestmentPlan(user) {
  const plans = await planRepository.findAllActive();
  const balance = await transactionRepository.getWalletBalance(user.id);
  return suggestPlan({ user, plans, wallet: { balance } });
}
