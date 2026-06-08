'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/Input';
import { apiRequest, ApiRequestError } from '@/lib/api/client';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: { email: email.trim().toLowerCase() },
      });

      console.log('Forgot password response:', response);
      setMessage('If the email exists, a reset link has been sent.');
      setEmail('');
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

      <div className="w-full max-w-md">

        {/* CARD */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8">

          {/* HEADER */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30 mb-4">
              <Mail className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-white">
              Forgot Password
            </h1>

            <p className="text-blue-200 text-sm mt-1">
              Enter your email to receive reset link
            </p>
          </div>

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
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm text-blue-200 mb-2 block">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-blue-300" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-blue-300 focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          {/* BACK TO LOGIN */}
          <div className="mt-6 text-center text-sm text-blue-200">
          
            <Link
              href="/login"
              className="text-white font-semibold hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
                 Back to{' '} Login
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}