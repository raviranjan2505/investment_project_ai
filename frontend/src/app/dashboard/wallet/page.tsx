'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { getWallet, getTransactions, type WalletResponse, type TransactionsResponse } from '@/lib/api/wallet';
import { ArrowUpRight, ArrowDownLeft, Wallet, Loader, Plus } from 'lucide-react';
import AddFundsModal from '@/components/AddFundsModal';

export default function WalletPage() {
  const router = useRouter();
  const { isAuthenticated, getToken } = useAuthStore();
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

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

        const [walletData, transactionData] = await Promise.all([
          getWallet(token),
          getTransactions(token),
        ]);

        setWallet(walletData);
        setTransactions(transactionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wallet');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router, getToken]);

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your funds and track transactions</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-semibold opacity-90">Total Balance</h2>
              <Wallet className="w-8 h-8 opacity-75" />
            </div>
            <p className="text-5xl font-bold mb-4">₹{wallet?.balance?.toLocaleString() ?? '0'}</p>
            <p className="text-blue-100">Available to invest or withdraw</p>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <p className="text-gray-600 text-sm mb-2">Total Invested</p>
              <p className="text-3xl font-bold text-gray-900">₹{wallet?.totalInvested?.toLocaleString() ?? '0'}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <p className="text-gray-600 text-sm mb-2">Total Returns Earned</p>
              <p className="text-3xl font-bold text-green-600">₹{wallet?.totalReturns?.toLocaleString() ?? '0'}</p>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
          
          {transactions && transactions?.items?.length > 0 ? (
            <div className="space-y-4">
              {transactions.items.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      tx.type === 'deposit' || tx.type === 'return'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'return' ? (
                        <ArrowDownLeft className={`w-6 h-6 ${tx.type === 'deposit' || tx.type === 'return' ? 'text-green-600' : 'text-red-600'}`} />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{tx.description}</p>
                      <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      tx.type === 'deposit' || tx.type === 'return'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {tx.type === 'deposit' || tx.type === 'return' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </p>
                    <p className={`text-sm ${
                      tx.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No transactions yet</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 flex-wrap">
          <button
            onClick={() => setIsAddFundsOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add Funds
          </button>
          <button
            onClick={() => router.push('/plans')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Invest Now
          </button>
          <button
            onClick={() => router.push('/dashboard/withdrawal')}
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            Withdraw
          </button>
        </div>

        {/* Add Funds Modal */}
        <AddFundsModal 
          isOpen={isAddFundsOpen}
          onClose={() => setIsAddFundsOpen(false)}
          token={getToken()}
        />
      </div>
    </div>
  );
}
