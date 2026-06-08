import { get, post } from './client';

export interface CryptoPayment {
  id: string;
  userId: string;
  paymentId: string;
  payAddress: string | null;
  paymentUrl: string | null;
  priceAmount: number;
  priceCurrency: string;
  payCurrency: string;
  status: 'waiting' | 'confirming' | 'confirmed' | 'finished' | 'failed' | 'expired' | 'refunded';
}

export interface CryptoPaymentResponse {
  payment: CryptoPayment;
  payment_link: string | null;
}

export interface PaymentStatusResponse {
  id: string;
  paymentId: string;
  payAddress: string | null;
  paymentUrl: string | null;
  priceAmount: number;
  priceCurrency: string;
  payCurrency: string;
  status: string;
  transactionStatus: 'pending' | 'completed' | 'failed';
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export async function createCryptoPayment(
  token: string,
  amount: number,
  payCurrency: string
): Promise<CryptoPaymentResponse> {
  return post<CryptoPaymentResponse>('/crypto/create-payment', { amount, pay_currency: payCurrency }, token);
}

export async function getPaymentStatus(
  token: string,
  paymentId: string
): Promise<PaymentStatusResponse> {
  return get<PaymentStatusResponse>(`/crypto/payment-status/${paymentId}`, token);
}
