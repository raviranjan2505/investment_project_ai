import { useEffect, useState, useCallback } from 'react';
import { getWallet, getTransactions, type WalletResponse, type TransactionsResponse } from '@/lib/api/wallet';

interface UseWalletDataOptions {
  token: string | null;
  enabled?: boolean;
  refetchInterval?: number; // ms between auto-refetch, 0 to disable
  transactionLimit?: number;
  transactionOffset?: number;
}

export function useWalletData({
  token,
  enabled = true,
  refetchInterval = 30000, // 30 seconds by default
  transactionLimit = 50,
  transactionOffset = 0,
}: UseWalletDataOptions) {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token || !enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [walletData, transactionData] = await Promise.all([
        getWallet(token),
        getTransactions(token, transactionLimit, transactionOffset),
      ]);

      setWallet(walletData);
      setTransactions(transactionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  }, [token, enabled, transactionLimit, transactionOffset]);

  // Initial fetch and setup polling
  useEffect(() => {
    fetchData();

    if (refetchInterval > 0 && enabled && token) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refetchInterval, enabled, token]);

  return { wallet, transactions, loading, error, refetch: fetchData };
}
