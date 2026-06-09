'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

import {
  getWallet,
  getTransactions,
  type WalletResponse,
  type TransactionsResponse,
} from '@/lib/api/wallet';
import {
  askAi,
  checkAiRisk,
  suggestAiPlan,
  type AiFraudCheckResponse,
  type AiPlanSuggestionResponse,
} from '@/lib/api/ai';

import {
  listInvestments,
  type InvestmentsListResponse,
} from '@/lib/api/investment';

import {
  TrendingUp,
  Wallet,
  Target,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  RotateCw,
  CheckCircle,
  Clock,
  Copy,
  Share2,
  Bot,
  Sparkles,
  Send,
  ShieldAlert,
  Lightbulb,
} from 'lucide-react';
import AddFundsModal from '@/components/AddFundsModal';

export default function DashboardPage() {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    isHydrated,
    getToken,
  } = useAuthStore();

  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [investments, setInvestments] = useState<InvestmentsListResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [siteOrigin, setSiteOrigin] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiPlan, setAiPlan] = useState<AiPlanSuggestionResponse | null>(null);
  const [aiRisk, setAiRisk] = useState<AiFraudCheckResponse | null>(null);
  const [aiLoading, setAiLoading] = useState<'chat' | 'plan' | 'risk' | null>(null);
  const [aiError, setAiError] = useState('');
  const investmentsRef = useRef<InvestmentsListResponse | null>(null);
  const initialLoadStartedRef = useRef(false);

  useEffect(() => {
    setSiteOrigin(window.location.origin);
  }, []);

  const referralLink = wallet?.referralCode && siteOrigin
    ? `${siteOrigin}/signup?referralCode=${wallet.referralCode}`
    : '';

  const handleCopyReferralLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      setNotification({
        message: 'Referral link copied to clipboard',
        type: 'info',
      });
      setTimeout(() => setNotification(null), 3000);
    } catch {
      setError('Unable to copy referral link right now');
    }
  };

  const getAiActivitySnapshot = () => ({
    balance: wallet?.balance ?? 0,
    totalInvested: wallet?.totalInvested ?? 0,
    totalReturns: wallet?.totalReturns ?? 0,
    referralIncome: wallet?.referralIncome ?? 0,
    recentTransactions: transactions?.items?.slice(0, 5).map((tx) => ({
      type: tx.type,
      amount: tx.amount,
      description: tx.description,
    })) ?? [],
    recentInvestments: investments?.items?.slice(0, 5).map((inv) => ({
      planName: inv.planName,
      amount: inv.amount,
      status: inv.status,
      returnPercentage: inv.returnPercentage,
    })) ?? [],
  });

  const handleAskAi = async () => {
    if (!aiQuestion.trim()) {
      setAiError('Please enter a question for the AI assistant.');
      return;
    }

    setAiError('');
    setAiLoading('chat');

    try {
      const token = getToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      const result = await askAi(token, aiQuestion.trim());
      setAiAnswer(result.reply);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI assistant request failed.');
    } finally {
      setAiLoading(null);
    }
  };

  const handleSuggestPlan = async () => {
    setAiError('');
    setAiLoading('plan');

    try {
      const token = getToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      const result = await suggestAiPlan(token);
      setAiPlan(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Plan suggestion request failed.');
    } finally {
      setAiLoading(null);
    }
  };

  const handleRiskCheck = async () => {
    setAiError('');
    setAiLoading('risk');

    try {
      const token = getToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      const result = await checkAiRisk(token, getAiActivitySnapshot());
      setAiRisk(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Risk check request failed.');
    } finally {
      setAiLoading(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const token = getToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      const [walletData, investmentData, transactionData] = await Promise.all([
        getWallet(token),
        listInvestments(token),
        getTransactions(token),
      ]);

      investmentsRef.current = investmentData;
      setWallet(walletData);
      setInvestments(investmentData);
      setTransactions(transactionData);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh dashboard');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    if (initialLoadStartedRef.current) return;
    initialLoadStartedRef.current = true;

    const fetchData = async () => {
      try {
        const token = getToken();

        if (!token) {
          router.replace('/login');
          return;
        }

        const [walletData, investmentData, transactionData] =
          await Promise.all([
            getWallet(token),
            listInvestments(token),
            getTransactions(token),
          ]);

        // Check if any investments just matured
        const previousInvestments = investmentsRef.current;
        if (previousInvestments && investmentData.items) {
          const previousActive = previousInvestments.items?.filter(inv => inv.status === 'active') || [];
          const currentActive = investmentData.items.filter(inv => inv.status === 'active');
          const justMatured = previousActive.length - currentActive.length;
          
          if (justMatured > 0) {
            setNotification({
              message: `🎉 ${justMatured} investment(s) matured! Returns credited to your wallet.`,
              type: 'success'
            });
            setTimeout(() => setNotification(null), 5000);
          }
        }

        investmentsRef.current = investmentData;
        setWallet(walletData);
        setInvestments(investmentData);
        setTransactions(transactionData);
        setError('');
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load dashboard'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    fetchData();
  }, [isHydrated, isAuthenticated, user, router, getToken]);

  /* ---------------- LOADING ---------------- */

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto animate-pulse space-y-6">
          <div className="h-32 bg-gray-300 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name} 👋
            </h1>
            <p className="text-gray-600">
              Manage your investments and track your wealth growth
            </p>
          </div>
          <button
            onClick={() => setIsAddFundsOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Funds
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg border ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Referral */}
        <div className="mb-8 rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                <Share2 className="h-4 w-4" />
                Referral Program
              </div>
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Share your link and earn referral income
              </h2>
              <p className="mt-2 text-gray-600">
                Invite friends with your personal referral link. When they invest, your referral income is credited automatically.
              </p>

              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Your referral link
                  </p>
                  <p className="truncate font-mono text-sm text-gray-900">
                    {referralLink || 'Referral link will appear after wallet data loads'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyReferralLink}
                  disabled={!referralLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:w-[360px] lg:grid-cols-1">
              <div className="rounded-2xl bg-gray-900 p-5 text-white shadow-md">
                <p className="text-sm text-gray-300">Referral Code</p>
                <p className="mt-2 break-all text-xl font-bold">
                  {wallet?.referralCode || 'Loading...'}
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-white shadow-md">
                <p className="text-sm text-emerald-100">Referral Income</p>
                <p className="mt-2 text-3xl font-bold">
                  ₹{wallet?.referralIncome?.toLocaleString() ?? '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="mb-8 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-cyan-200">
                <Bot className="h-4 w-4" />
                AI Assistant
              </div>
              <h2 className="mt-4 text-2xl font-bold">
                Get guided help, plan ideas, and a quick account risk scan
              </h2>
              <p className="mt-2 text-slate-300">
                Ask a question, request a plan suggestion, or run a lightweight AI review of your recent account activity.
                Results are informational only and do not guarantee returns.
              </p>

              <div className="mt-5 space-y-3">
                <textarea
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  rows={4}
                  placeholder="Ask about withdrawals, investing, referral income, or platform usage..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none ring-0 focus:border-cyan-400"
                />

                {aiError && (
                  <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {aiError}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAskAi}
                    disabled={aiLoading === 'chat'}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {aiLoading === 'chat' ? 'Sending...' : 'Ask AI'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSuggestPlan}
                    disabled={aiLoading === 'plan'}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Lightbulb className="h-4 w-4" />
                    {aiLoading === 'plan' ? 'Analyzing...' : 'Suggest Plan'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRiskCheck}
                    disabled={aiLoading === 'risk'}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    {aiLoading === 'risk' ? 'Scanning...' : 'Risk Check'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:w-[360px]">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2 text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  Latest AI Reply
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-200">
                  {aiAnswer || 'Your AI response will appear here after you send a question.'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-cyan-200">Plan Suggestion</p>
                {aiPlan ? (
                  <div className="mt-3 space-y-2 text-sm text-slate-200">
                    <p>
                      <span className="font-semibold text-white">Recommended:</span> {aiPlan.suggested_plan_slug}
                    </p>
                    <p>{aiPlan.rationale}</p>
                    <p>
                      <span className="font-semibold text-white">Alternative:</span>{' '}
                      {aiPlan.alternative_plan_slug || 'None'}
                    </p>
                    {aiPlan.risk_notes?.length ? (
                      <ul className="list-disc space-y-1 pl-5 text-slate-300">
                        {aiPlan.risk_notes.map((note, index) => (
                          <li key={index}>{note}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-300">
                    Use "Suggest Plan" to get a personalized plan idea.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-cyan-200">Risk Check</p>
                {aiRisk ? (
                  <div className="mt-3 space-y-2 text-sm text-slate-200">
                    <p>
                      <span className="font-semibold text-white">Score:</span> {aiRisk.risk_score}/100
                    </p>
                    <p>
                      <span className="font-semibold text-white">Level:</span> {aiRisk.risk_level}
                    </p>
                    <p>{aiRisk.recommended_action}</p>
                    {aiRisk.reasons?.length ? (
                      <ul className="list-disc space-y-1 pl-5 text-slate-300">
                        {aiRisk.reasons.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-300">
                    Run a risk check to review recent activity signals.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Balance */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Balance</h3>
              <Wallet className="text-blue-600" />
            </div>

            <p className="text-3xl font-bold">
              ₹{wallet?.balance?.toLocaleString() ?? '0'}
            </p>
          </div>

          {/* Invested */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Invested</h3>
              <Target className="text-green-600" />
            </div>

            <p className="text-3xl font-bold">
              ₹{wallet?.totalInvested?.toLocaleString() ?? '0'}
            </p>
          </div>

          {/* Returns */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Total Returns</h3>
              <TrendingUp className="text-purple-600" />
            </div>

            <p className="text-3xl font-bold">
              ₹{wallet?.totalReturns?.toLocaleString() ?? '0'}
            </p>
          </div>

          {/* Remaining Investment */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-gray-600 font-semibold">Remaining Investment</h3>
              <DollarSign className="text-orange-600" />
            </div>

            <p className="text-3xl font-bold">
              ₹{wallet?.remainingInvestment?.toLocaleString() ?? '0'}
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Investments */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Investments</h2>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                title="Refresh investments"
              >
                <RotateCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {investments?.items?.length ? (
              <div className="space-y-4">
                {investments.items.slice(0, 5).map((inv) => (
                  <div
                    key={inv.id}
                    className={`p-4 rounded-lg border-2 transition ${
                      inv.status === 'completed'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold">{inv.planName}</p>
                          {inv.status === 'completed' ? (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-200 text-blue-800 text-xs font-semibold rounded">
                              <Clock className="w-3 h-3" />
                              Active
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Invested: {new Date(inv.investedAt).toLocaleDateString()}
                        </p>
                        {inv.status === 'completed' && (
                          <p className="text-sm text-gray-500">
                            Completed: {new Date(inv.maturityAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          ₹{inv.amount.toLocaleString()}
                        </p>
                        <p className="text-green-600 text-sm font-medium">
                          +₹{inv.returns?.toLocaleString()} ({inv.returnPercentage}%)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No investments yet
              </p>
            )}
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold mb-4">Recent Transactions</h3>

            {transactions?.items?.length ? (
              <div className="space-y-3">
                {transactions.items.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between text-sm"
                  >
                    <div className="flex gap-2 items-center">
                      {tx.type === 'deposit' || tx.type === 'return' ? (
                        <ArrowDownLeft className="text-green-600 w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="text-red-600 w-4 h-4" />
                      )}

                      <span>{tx.description}</span>
                    </div>

                    <span
                      className={
                        tx.type === 'deposit' || tx.type === 'return'
                          ? 'text-green-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      }
                    >
                      {tx.type === 'deposit' || tx.type === 'return'
                        ? '+'
                        : '-'}
                      ₹{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No transactions yet
              </p>
            )}
          </div>
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
