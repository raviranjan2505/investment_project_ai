'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { AlertCircle, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // reusable input style (FIXED)
  const inputClass =
    "w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">

      {/* background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/30 blur-[120px] rounded-full" />
      </div>

      {/* CARD */}
      <div className="w-full max-w-md">

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">

          {/* HEADER */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30 mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white">
              InvestPro
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              Smart Investment Platform
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-400/30 flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm text-blue-200 mb-2 block">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-blue-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-blue-200 mb-2 block">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-blue-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={inputClass}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* OPTIONS */}
            <div className="flex justify-between text-sm text-blue-200">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-500" />
                Remember me
              </label>

              <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300">
                Forgot Password?
              </Link>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* SIGNUP */}
          <div className="mt-6 text-center text-sm text-blue-200">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-white font-semibold hover:underline">
              Create account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}