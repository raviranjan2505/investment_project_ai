import { useEffect, useState, useCallback } from 'react';
import { getPaymentStatus, type PaymentStatus } from '@/lib/api/wallet';

interface UsePaymentStatusOptions {
  token: string | null;
  paymentId?: string;
  pollInterval?: number | null; // ms between checks; null disables polling
}

export function usePaymentStatus({ token, paymentId, pollInterval = null }: UsePaymentStatusOptions) {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    if (!token || !paymentId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getPaymentStatus(token, paymentId);
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check payment status');
    } finally {
      setLoading(false);
    }
  }, [token, paymentId]);

  useEffect(() => {
    if (!token || !paymentId) return;

    checkStatus();

    if (!pollInterval) return;

    const interval = setInterval(checkStatus, pollInterval);

    return () => clearInterval(interval);
  }, [token, paymentId, pollInterval, checkStatus]);

  return { status, loading, error, refetch: checkStatus };
}
