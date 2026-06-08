import { get, post } from './client';

export interface Wallet {
  id: string;
  balance: number;
  totalInvested: number;
  totalReturns: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'return' | 'referral_bonus' | 'crypto_payment';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface WalletResponse {
  balance: number;
  availableBalance: number;
  totalInvested: number;
  totalReturns: number;
  remainingInvestment: number;
  referralIncome: number;
  referralCode: string | null;
}

export interface TransactionsResponse {
  items: Transaction[];
  total: number;
}

export interface PaymentStatus {
  id: string;
  paymentId: string;
  payAddress: string | null;
  paymentUrl: string | null;
  priceAmount: number;
  priceCurrency: string;
  payCurrency: string;
  status: string;
  transactionStatus: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export async function getWallet(token: string): Promise<WalletResponse> {
  return get<WalletResponse>('/wallet', token);
}

export async function getTransactions(
  token: string,
  limit?: number,
  offset?: number
): Promise<TransactionsResponse> {
  const query = new URLSearchParams();
  if (limit !== undefined) query.append('limit', String(limit));
  if (offset !== undefined) query.append('offset', String(offset));

  const path = `/transactions${query.toString() ? '?' + query.toString() : ''}`;
  return get<TransactionsResponse>(path, token);
}

export async function getPaymentStatus(
  token: string,
  paymentId: string
): Promise<PaymentStatus> {
  return get<PaymentStatus>(`/payment-status/${paymentId}`, token);
}
