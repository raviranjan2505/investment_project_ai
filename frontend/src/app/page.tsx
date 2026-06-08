'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ReactElement } from 'react';
import { TrendingUp, Lock, Zap, Users, ArrowRight, CheckCircle } from 'lucide-react';
import InvestmentPlanCard from '@/components/investment/InvestmentPlanCard';
import { getPlans, type InvestmentPlan } from '@/lib/api/plans';

export default function HomePage(): ReactElement {
 const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getPlans();
        setPlans(data.items);
      } catch (err) {
        console.error('Failed to load plans', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);


  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/30 rounded-full blur-[120px]" />
      </div>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          {/* LEFT */}
          <div className="space-y-8">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-blue-100 font-medium">
                Smart Investment Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Grow Your Wealth With{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Smart Investments
              </span>
            </h1>

            <p className="text-lg text-blue-100 leading-relaxed max-w-xl">
              Invest in high-yield plans, track your returns in real-time, and build your financial future with confidence.
            </p>

            <div className="flex gap-4">
              <Link
                href="/signup"
                className="px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 transition font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/30"
              >
                Get Started <ArrowRight size={18} />
              </Link>

              <Link
                href="/login"
                className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition font-semibold"
              >
                Sign In
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <p className="text-3xl font-bold">₹50K+</p>
                <p className="text-blue-200 text-sm">Active Investors</p>
              </div>
              <div>
                <p className="text-3xl font-bold">18%</p>
                <p className="text-blue-200 text-sm">Average Returns</p>
              </div>
              <div>
                <p className="text-3xl font-bold">₹100Cr+</p>
                <p className="text-blue-200 text-sm">Total Invested</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="relative h-[420px]">

              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl" />

              <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">

                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-blue-200 text-sm">Live Investment Plans</h3>
                  <TrendingUp className="text-green-400" />
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                    <p className="font-semibold">Gold Plan</p>
                    <p className="text-sm text-blue-200">₹15,000 - ₹19,999</p>
                    <p className="text-green-400 font-bold mt-1">18% Returns</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                    <p className="font-semibold">Platinum Plan</p>
                    <p className="text-sm text-blue-200">₹20,000+</p>
                    <p className="text-green-400 font-bold mt-1">25% Returns</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold">Why Choose InvestPro?</h2>
          <p className="text-blue-200 mt-2">Everything you need to invest smart and grow wealth</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
            <Lock className="w-6 h-6 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
            <p className="text-blue-200 text-sm">
              Your investments are protected with industry-grade encryption and compliance systems.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
            <Zap className="w-6 h-6 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">High Returns</h3>
            <p className="text-blue-200 text-sm">
              Earn competitive returns ranging from 8% to 25% based on your plan.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
            <Users className="w-6 h-6 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-blue-200 text-sm">
              Join thousands of investors building passive income together.
            </p>
          </div>

        </div>
      </section>

{/* INVESTMENT PLANS */}
 {/* INVESTMENT PLANS SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold">Investment Plans</h2>
          <p className="text-blue-200 mt-2">
            Choose the plan that fits your financial goals
          </p>
        </div>

        {loading ? (
          <div className="text-center text-blue-200">Loading plans...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <InvestmentPlanCard
                key={plan.id}
                plan={plan}
                index={index}
                isAuthenticated={false} // home page = public
              />
            ))}
          </div>
        )}
      </section>

{/* CTA SECTION */}
<section className="relative py-24 px-6 overflow-hidden">

  {/* background glow */}
  <div className="absolute inset-0">
    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-[120px]" />
    <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-400/30 rounded-full blur-[120px]" />
  </div>

  <div className="relative max-w-4xl mx-auto text-center">

    {/* glass container */}
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl">

      {/* badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-400/20 mb-6">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-sm text-green-200 font-medium">
          Trusted by 50,000+ Investors
        </span>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold leading-tight">
        Ready to Start{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          Investing?
        </span>
      </h2>

      <p className="text-blue-200 mt-4 mb-10 text-lg">
        Join thousands of investors growing their wealth every day with smart investment plans.
      </p>

      {/* CTA BUTTON */}
    <Link
  href="/signup"
  className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold !text-blue-900 bg-white hover:bg-blue-50 transition shadow-lg shadow-blue-500/20"
>
  <span>Create Account</span>
  <ArrowRight className="group-hover:translate-x-1 transition" />
</Link>

      {/* small trust line */}
      <p className="text-xs text-blue-300 mt-6">
        🔒 Secure • Fast Withdrawal • Transparent Returns
      </p>

    </div>
  </div>
</section>

    </main>
  );
}