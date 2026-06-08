'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { AlertCircle, Lock, Mail, User, Share2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const referralFromUrl =
      searchParams.get('referralCode') || searchParams.get('ref');

    if (referralFromUrl) {
      setFormData((prev) =>
        prev.referralCode ? prev : { ...prev, referralCode: referralFromUrl }
      );
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.referralCode || undefined
      );
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // reusable input style
  const inputClass =
    "w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500 outline-none";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">

      {/* glow background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/30 blur-[120px] rounded-full" />
      </div>

      {/* CARD */}
      <div className="w-full max-w-md">

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">

          {/* HEADER */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 border border-white/10">
              <User className="w-7 h-7 text-blue-300" />
            </div>

            <h1 className="text-3xl font-bold text-white mt-3">
              InvestPro
            </h1>
            <p className="text-blue-200 text-sm">
              Start Your Investment Journey
            </p>
          </div>

          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            Create your account
          </h2>

          {/* ERROR */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <div>
              <label className="text-sm text-blue-200 mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-blue-300" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-blue-200 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-blue-300" />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-blue-200 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-blue-300" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm text-blue-200 mb-1 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-blue-300" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* REFERRAL */}
            <div>
              <label className="text-sm text-blue-200 mb-1 block">Referral Code</label>
              <div className="relative">
                <Share2 className="absolute left-3 top-3 w-4 h-4 text-blue-300" />
                <input
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className={inputClass}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={isLoading}
              className="w-full mt-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 transition"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>

          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-blue-200 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-white font-medium hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
