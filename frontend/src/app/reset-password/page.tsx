'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/Input';
import { apiRequest, ApiRequestError } from '@/lib/api/client';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: { token, newPassword: password },
      });

      setMessage('Password reset successfully! Redirecting...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">

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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30 mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white">
              Reset Password
            </h1>

            <p className="text-blue-200 text-sm mt-1">
              Create a strong new password
            </p>
          </div>

          {/* INVALID TOKEN */}
          {!token && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-400/30 text-center">
              <p className="text-red-200 text-sm">
                Invalid or missing reset token.
              </p>

              <button
                onClick={() => router.push('/forgot-password')}
                className="mt-3 text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Back to Forgot Password
              </button>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-400/30 flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* SUCCESS */}
          {message && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-400/30 flex gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <p className="text-green-200 text-sm">{message}</p>
            </div>
          )}

          {/* FORM */}
          {token && (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-blue-200 mb-2 block">
                  New Password
                </label>

                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="text-sm text-blue-200 mb-2 block">
                  Confirm Password
                </label>

                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 transition disabled:opacity-50"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}

        </div>
      </div>
    </main>
  );
}