'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Users, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalInvestments: number;
  totalReturns: number;
  pendingWithdrawals: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, getToken } = useAuthStore();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalInvestments: 0,
    totalReturns: 0,
    pendingWithdrawals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Wait for auth initialization before checking
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push('/login');
          return;
        }

        // TODO: Replace with actual admin API calls
        setStats({
          totalUsers: 1250,
          totalInvestments: 45600000,
          totalReturns: 5280000,
          pendingWithdrawals: 12,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, isHydrated, router, getToken]);

  if (!isAuthenticated) return null;

  if (loading || !isHydrated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-300 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage platform operations and monitor key metrics</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Users</h3>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">Active investors</p>
          </div>

          {/* Total Investments */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Investments</h3>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{(stats.totalInvestments / 100000).toFixed(1)}L</p>
            <p className="text-sm text-gray-500 mt-2">Total capital invested</p>
          </div>

          {/* Total Returns */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Returns</h3>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{(stats.totalReturns / 100000).toFixed(1)}L</p>
            <p className="text-sm text-gray-500 mt-2">Total returns distributed</p>
          </div>

          {/* Pending Withdrawals */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Pending Withdrawals</h3>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingWithdrawals}</p>
            <p className="text-sm text-gray-500 mt-2">Awaiting approval</p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
                Manage Users
              </button>
              <button className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition">
                Manage Plans
              </button>
              <button className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition">
                Review Withdrawals
              </button>
              <button className="w-full bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 transition">
                View Reports
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Database</span>
                <span className="flex items-center gap-2 text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">API Server</span>
                <span className="flex items-center gap-2 text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Running
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Payment Gateway</span>
                <span className="flex items-center gap-2 text-green-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-gray-700 font-medium">Email Service</span>
                <span className="flex items-center gap-2 text-yellow-600">
                  <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
                  Degraded
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
