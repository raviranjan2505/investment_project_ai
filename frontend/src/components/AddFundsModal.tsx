'use client';

import { useState } from 'react';
import { AlertCircle, Loader, X } from 'lucide-react';
import Modal from '@/components/ui/modal';
import { createCryptoPayment } from '@/lib/api/crypto';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
}

const PAYMENT_METHODS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH' },
  { id: 'usdt', name: 'Tether (USDT)', symbol: 'USDT' },
  { id: 'usdc', name: 'USD Coin (USDC)', symbol: 'USDC' },
];

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

export default function AddFundsModal({ isOpen, onClose, token }: AddFundsModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('btc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const handleReset = () => {
    setAmount('');
    setSelectedMethod('btc');
    setError('');
    setSuccess(false);
    setPaymentLink(null);
    setLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handlePresetAmount = (preset: number) => {
    setAmount(preset.toString());
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (Number(amount) < 500) {
      setError('Minimum deposit amount is ₹500');
      return;
    }

    if (Number(amount) > 10000000) {
      setError('Maximum deposit amount is ₹1,00,00,000');
      return;
    }

    if (!token) {
      setError('Authentication required. Please login again.');
      return;
    }

    setLoading(true);

    try {
      const result = await createCryptoPayment(token, Number(amount), selectedMethod);

      if (result.payment_link) {
        setPaymentLink(result.payment_link);
        setSuccess(true);
      } else {
        setError('Failed to generate payment link. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  if (success && paymentLink) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Payment Initiated" maxWidth="md">
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Payment Ready</h3>
            <p className="text-gray-600 mt-2">₹{Number(amount).toLocaleString('en-IN')} via {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              You will be redirected to complete your payment. Please keep this window open until the payment is confirmed.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.open(paymentLink, '_blank')}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Open Payment Gateway
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Payment link: <span className="font-mono text-xs truncate">{paymentLink}</span></p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Funds to Wallet" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Amount (₹)
          </label>

          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            placeholder="Enter amount"
            min="500"
            step="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <p className="text-xs text-gray-500 mt-1">Min: ₹500 | Max: ₹1,00,00,000</p>
        </div>

        {/* Preset Amounts */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">
            Quick Amount
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetAmount(preset)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                  amount === preset.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ₹{(preset / 1000).toFixed(0)}K
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Payment Method
          </label>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <label key={method.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="payment_method"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="ml-3 flex-1">
                  <p className="font-medium text-gray-900">{method.name}</p>
                  <p className="text-xs text-gray-500">{method.symbol}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Info Message */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-900">
            💡 Your funds will be credited to your wallet immediately after payment confirmation.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading ? 'Processing...' : `Add ₹${amount || '0'}`}
          </button>
        </div>
      </form>
    </Modal>
  );
}
