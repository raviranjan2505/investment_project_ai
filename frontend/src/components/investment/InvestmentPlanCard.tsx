'use client';

import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type InvestmentPlan = {
  id: string;
  name: string;
  slug: string;
  minAmount: number;
  maxAmount: number;
  returnPercentage: number;
  duration: number;
  durationUnit: string;
  features?: string[];
  description?: string;
};

type Props = {
  plan: InvestmentPlan;
  isAuthenticated: boolean;
  index?: number;
  onInvest?: (slug: string) => void;
};

const themes = [
  {
    border: 'from-blue-500 to-cyan-400',
    text: 'text-blue-100',
    button: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white',
  },
  {
    border: 'from-purple-500 to-pink-500',
    text: 'text-purple-100',
    button: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  },
  {
    border: 'from-green-400 to-emerald-500',
    text: 'text-green-100',
    button: 'bg-gradient-to-r from-green-500 to-emerald-400 text-white',
  },
  {
    border: 'from-orange-400 to-yellow-500',
    text: 'text-yellow-100',
    button: 'bg-gradient-to-r from-orange-400 to-yellow-400 text-black',
  },
];

export default function InvestmentPlanCard({
  plan,
  isAuthenticated,
  index = 0,
  onInvest,
}: Props) {
  const router = useRouter();
  const theme = themes[index % themes.length];
  const isPopular = plan.returnPercentage >= 18;

  const handleClick = () => {
    if (onInvest) return onInvest(plan.slug);
    if (!isAuthenticated) return router.push('/login');
    router.push(`/invest/${plan.slug}`);
  };

  return (
    <div className={`group relative rounded-3xl p-[1px] bg-gradient-to-br ${theme.border} transition-transform hover:-translate-y-2`}>

      <div className="relative h-full rounded-3xl p-6 backdrop-blur-xl bg-black/30 border border-white/10">

        {/* POPULAR */}
        {isPopular && (
          <div className="mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-200 border border-yellow-400/30">
              POPULAR
            </span>
          </div>
        )}

        {/* TITLE */}
        <h3 className={`text-2xl font-bold ${theme.text}`}>
          {plan.name}
        </h3>

        <p className="text-sm text-blue-200 mt-1">
          ₹{plan.minAmount.toLocaleString()} - ₹{plan.maxAmount.toLocaleString()}
        </p>

        {/* ROI */}
        <div className="mt-6">
          <p className="text-5xl font-bold text-white">
            {plan.returnPercentage}
            <span className="text-lg ml-1 text-blue-300">%</span>
          </p>
          <p className="text-sm text-blue-200">Returns</p>
        </div>

        {/* DURATION */}
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-blue-200">Duration</span>
          <span className="text-white font-semibold">
            {plan.duration} {plan.durationUnit}
          </span>
        </div>

        {/* FEATURES */}
        {plan.features?.length ? (
          <ul className="mt-5 space-y-2">
            {plan.features.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-100">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        ) : null}

        {/* BUTTON */}
        <button
          onClick={handleClick}
          className={`mt-6 w-full py-3 rounded-xl font-bold transition ${theme.button}`}
        >
          {isAuthenticated ? 'Invest Now' : 'Sign Up to Invest'}
        </button>

        {/* DESCRIPTION */}
        {plan.description && (
          <p className="mt-4 text-xs text-blue-300/70">
            {plan.description}
          </p>
        )}

      </div>
    </div>
  );
}