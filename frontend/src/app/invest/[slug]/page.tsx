'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { getPlans, type InvestmentPlan } from '@/lib/api/plans';
import { invest } from '@/lib/api/investment';
import { AlertCircle, CheckCircle, Loader, ArrowLeft } from 'lucide-react';

export default function InvestPage() {
  const router = useRouter();
  const params = useParams();
  const planslug = params.slug as string;
  const { isAuthenticated, getToken } = useAuthStore();

  const [plan, setPlan] = useState<InvestmentPlan | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchPlan = async () => {
      try {
        const data = await getPlans();
        const foundPlan = data.items.find((p) => p.slug === planslug);

        if (!foundPlan) {
          setError('Plan not found');
          return;
        }

        setPlan(foundPlan);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plan');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [isAuthenticated, planslug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!plan) return setError('Plan not found');

    const investmentAmount = parseFloat(amount);

    if (!investmentAmount || investmentAmount < plan.minAmount) {
      return setError(`Minimum investment is ₹${plan.minAmount.toLocaleString()}`);
    }

    if (investmentAmount > plan.maxAmount) {
      return setError(`Maximum investment is ₹${plan.maxAmount.toLocaleString()}`);
    }

    setSubmitting(true);

    try {
      const token = getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      await invest(plan.slug, investmentAmount, token);

      setSuccess('Investment successful! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Investment failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <Loader className="w-12 h-12 text-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-2xl text-center text-white">
          {error || 'Plan not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">

      {/* glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/30 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl">

        {/* BACK CARD */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-300 hover:text-white flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* MAIN CARD */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-white">

          {/* TITLE */}
          <h1 className="text-3xl font-bold">{plan.name}</h1>
          <p className="text-blue-200 mt-1">{plan.description}</p>

          {/* ERROR / SUCCESS */}
          {error && (
            <div className="mt-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2">
              <AlertCircle className="text-red-400 w-5 h-5 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-5 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex gap-2">
              <CheckCircle className="text-green-400 w-5 h-5 mt-0.5" />
              <p className="text-green-200 text-sm">{success}</p>
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4 mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div>
              <p className="text-blue-300 text-sm">Min</p>
              <p className="text-xl font-bold">₹{plan.minAmount.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-blue-300 text-sm">Max</p>
              <p className="text-xl font-bold">₹{plan.maxAmount.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-blue-300 text-sm">Returns</p>
              <p className="text-xl font-bold text-green-400">{plan.returnPercentage}%</p>
            </div>

            <div>
              <p className="text-blue-300 text-sm">Duration</p>
              <p className="text-xl font-bold">{plan.duration} {plan.durationUnit}</p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">

            <div>
              <label className="text-sm text-blue-200 mb-2 block">
                Investment Amount
              </label>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={submitting}
              />
            </div>

            {/* FEATURES */}
            {plan.features?.length ? (
              <ul className="space-y-2 text-sm text-blue-200">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            ) : null}

            {/* TERMS */}
            <label className="flex items-start gap-2 text-sm text-blue-200">
              <input type="checkbox" className="mt-1 accent-cyan-400" required />
              I agree to terms and understand investment risks
            </label>

            {/* BUTTON */}
            <button
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 transition"
            >
              {submitting ? 'Processing...' : `Invest ₹${amount || 0}`}
            </button>
          </form>

          {/* DISCLAIMER */}
          <p className="text-xs text-blue-300 mt-6 border-t border-white/10 pt-4">
            ⚠ Investments are subject to market risk. Please invest responsibly.
          </p>

        </div>
      </div>
    </div>
  );
}