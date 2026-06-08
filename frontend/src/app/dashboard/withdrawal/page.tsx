'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { requestWithdrawal, getWithdrawals, type WithdrawalsListResponse } from '@/lib/api/withdrawal';
import { getWallet, type WalletResponse } from '@/lib/api/wallet';
import { AlertCircle, CheckCircle, Clock, Loader } from 'lucide-react';

export default function WithdrawalPage() {
  const router = useRouter();
  const { isAuthenticated, getToken } = useAuthStore();
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [withdrawals, setWithdrawals] = useState<WithdrawalsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    method: 'bank' as 'bank' | 'upi',
    bankAccount: '',
    upiId: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const [walletData, withdrawalData] = await Promise.all([
          getWallet(token),
          getWithdrawals(token),
        ]);

        setWallet(walletData);
        setWithdrawals(withdrawalData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load withdrawal data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router, getToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseFloat(formData.amount);
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > (wallet?.availableBalance || 0)) {
      setError('Insufficient balance');
      return;
    }

    if (formData.method === 'bank' && !formData.bankAccount) {
      setError('Please enter your bank account details');
      return;
    }

    if (formData.method === 'upi' && !formData.upiId) {
      setError('Please enter your UPI ID');
      return;
    }

    setSubmitting(true);

    try {
      const token = getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      await requestWithdrawal(
        {
          amount,
          ...(formData.method === 'bank' && { bankAccount: formData.bankAccount }),
          ...(formData.method === 'upi' && { upiId: formData.upiId }),
        },
        token
      );

      setSuccess('Withdrawal request submitted successfully');
      setFormData({ amount: '', method: 'bank', bankAccount: '', upiId: '' });
      
      // Refresh withdrawals list
      const withdrawalData = await getWithdrawals(token);
      setWithdrawals(withdrawalData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Withdraw Funds</h1>
          <p className="text-gray-600">Request a withdrawal from your account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Withdrawal Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <p className="text-green-700">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 text-lg">₹</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Enter amount"
                    min="100"
                    step="100"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={submitting}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Available: ₹{wallet?.availableBalance.toLocaleString()}
                </p>
              </div>

              {/* Withdrawal Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Withdrawal Method</label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition"
                    style={{ borderColor: formData.method === 'bank' ? '#3b82f6' : '' }}>
                    <input
                      type="radio"
                      value="bank"
                      checked={formData.method === 'bank'}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value as 'bank' })}
                      className="w-4 h-4"
                      disabled={submitting}
                    />
                    <span className="ml-3">Bank Transfer</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition"
                    style={{ borderColor: formData.method === 'upi' ? '#3b82f6' : '' }}>
                    <input
                      type="radio"
                      value="upi"
                      checked={formData.method === 'upi'}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value as 'upi' })}
                      className="w-4 h-4"
                      disabled={submitting}
                    />
                    <span className="ml-3">UPI</span>
                  </label>
                </div>
              </div>

              {/* Bank Details */}
              {formData.method === 'bank' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Bank Account Details</label>
                  <input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    placeholder="Account number / IFSC code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={submitting}
                  />
                </div>
              )}

              {/* UPI Details */}
              {formData.method === 'upi' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">UPI ID</label>
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={submitting}
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Processing...' : 'Request Withdrawal'}
              </button>
            </form>
          </div>

          {/* Withdrawal History */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Withdrawals</h3>
              {withdrawals && withdrawals.items.length > 0 ? (
                <div className="space-y-3">
                  {withdrawals.items.slice(0, 5).map((wd) => (
                    <div key={wd.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">₹{wd.amount.toLocaleString()}</span>
                        {wd.status === 'completed' && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {wd.status === 'pending' && (
                          <Clock className="w-5 h-5 text-yellow-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        {new Date(wd.requestedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600 capitalize">{wd.method}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">No withdrawals yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
