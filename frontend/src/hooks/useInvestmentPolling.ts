import { useEffect, useState } from 'react';
import { listInvestments, InvestmentsListResponse } from '@/lib/api/investment';
import { useAuthStore } from '@/store/useAuthStore';

interface UseInvestmentPollingOptions {
  enabled?: boolean;
  intervalMs?: number; // Default 5 minutes
  onMatured?: (count: number) => void;
}

/**
 * Hook to periodically refresh investments and detect matured ones
 * Automatically checks every 5 minutes for completed investments
 */
export function useInvestmentPolling(options: UseInvestmentPollingOptions = {}) {
  const {
    enabled = true,
    intervalMs = 5 * 60 * 1000, // 5 minutes default
    onMatured
  } = options;

  const { getToken } = useAuthStore();
  const [data, setData] = useState<InvestmentsListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      const token = getToken();
      if (!token) return;

      const result = await listInvestments(token);
      
      // Check if any investments just completed
      if (data && result.items) {
        const previousActive = data.items.filter(inv => inv.status === 'active');
        const currentActive = result.items.filter(inv => inv.status === 'active');
        const justMatured = previousActive.length - currentActive.length;
        
        if (justMatured > 0) {
          console.log(`[Investment Polling] 🎉 ${justMatured} investment(s) just matured!`);
          onMatured?.(justMatured);
        }
      }

      setData(result);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch investments';
      setError(message);
      console.error('[Investment Polling] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    // Fetch immediately on mount
    fetch();

    // Set up polling interval
    const interval = setInterval(fetch, intervalMs);

    return () => clearInterval(interval);
  }, [enabled, intervalMs]);

  return { data, loading, error, refresh: fetch };
}
