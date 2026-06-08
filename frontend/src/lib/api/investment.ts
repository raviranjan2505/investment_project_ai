import { post, get } from './client';

export interface Investment {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  returnPercentage: number;
  investedAt: string;
  maturityAt: string;
  status: 'active' | 'completed' | 'cancelled';
  returns?: number;
  profit?: number;
}

export interface InvestmentResponse {
  success: boolean;
  investment: Investment;
}

export interface InvestmentsListResponse {
  items: Investment[];
  total: number;
}

export async function invest(
  plan: string,
  amount: number,
  token: string
): Promise<InvestmentResponse> {
  return post<InvestmentResponse>(
    `/invest/${plan}`,
    { amount },
    token
  );
}

export async function listInvestments(token: string): Promise<InvestmentsListResponse> {
  return get<InvestmentsListResponse>('/invest', token);
}
