'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { getPlans, type InvestmentPlan } from '@/lib/api/plans';
import { CheckCircle, Loader } from 'lucide-react';
import InvestmentPlanCard from '@/components/investment/InvestmentPlanCard';

export default function PlansPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleInvest = (slug: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push(`/invest/${slug}`);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-blue-200">Loading investment plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-slate-950 p-4 md:p-8 overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Investment Plans
          </h1>
          <p className="text-blue-200 mt-3 text-lg">
            Choose the perfect plan for your investment goals
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {plans.length === 0 ? (
          <div className="text-center py-12 text-blue-200">
            No investment plans available at the moment
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <InvestmentPlanCard
                key={plan.id}
                plan={plan}
                index={index}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 text-center">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:opacity-90 transition"
            >
              Create Account
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}