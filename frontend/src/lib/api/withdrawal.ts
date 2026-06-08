import { post, get } from './client';

export interface WithdrawalRequest {
  amount: number;
  bankAccount?: string;
  upiId?: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  method: 'bank' | 'upi';
  requestedAt: string;
  processedAt?: string;
}

export interface WithdrawalResponse {
  success: boolean;
  withdrawal: Withdrawal;
}

export interface WithdrawalsListResponse {
  items: Withdrawal[];
  total: number;
}

export async function requestWithdrawal(
  data: WithdrawalRequest,
  token: string
): Promise<WithdrawalResponse> {
  return post<WithdrawalResponse>('/withdrawal', data, token);
}

export async function getWithdrawals(token: string): Promise<WithdrawalsListResponse> {
  return get<WithdrawalsListResponse>('/withdrawal', token);
}
