import { get } from './client';

export interface InvestmentPlan {
  id: string;
  name: string;
  slug: string;
  minAmount: number;
  maxAmount: number;
  returnPercentage: number;
  duration: number;
  durationUnit: 'days' | 'months' | 'years';
  description?: string;
  features?: string[];
}

interface ApiInvestmentPlan {
  id: string;
  slug: string;
  name: string;
  min_amount: string;
  max_amount: string;
  return_rate: string;
  duration_days: number;
  referral_bonus_rate: string;
}

function toInvestmentPlan(plan: ApiInvestmentPlan): InvestmentPlan {
  const returnRate = Number(plan.return_rate);
  const duration = Number(plan.duration_days);

  return {
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    minAmount: Number(plan.min_amount),
    maxAmount: Number(plan.max_amount),
    returnPercentage: returnRate,
    duration,
    durationUnit: 'days',
    description: `${returnRate}% returns over ${duration} days.`,
    features: [
      `${plan.referral_bonus_rate}% referral bonus`,
      'Secure wallet tracking',
      'Automated return calculation',
    ],
  };
}

export async function getPlans(): Promise<{ items: InvestmentPlan[] }> {
  const response = await get<{ plans: ApiInvestmentPlan[] } | { items: InvestmentPlan[] }>('/plans');

  if ('items' in response) {
    return response;
  }

  return { items: response.plans.map(toInvestmentPlan) };
}
