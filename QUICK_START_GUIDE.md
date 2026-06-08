# Add Funds Feature - Quick Start Guide

## Overview
Complete wallet recharge system with crypto payment integration via NOWPayments.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (React/Next)              │
├─────────────────────────────────────────────────────┤
│ Components:                                         │
│ - AddFundsModal (modal form)                       │
│ - Wallet Page (transaction list)                   │
│ - Dashboard (add funds button)                     │
├─────────────────────────────────────────────────────┤
│ Hooks:                                              │
│ - useWalletData (fetch + auto-poll)               │
│ - usePaymentStatus (track payment)                │
├─────────────────────────────────────────────────────┤
│ APIs:                                               │
│ - createCryptoPayment()                           │
│ - getPaymentStatus()                              │
│ - getWallet()                                      │
│ - getTransactions()                                │
└─────────────────────────────────────────────────────┘
            ↓ (HTTP REST)
┌─────────────────────────────────────────────────────┐
│                 Backend (Node.js/Express)            │
├─────────────────────────────────────────────────────┤
│ Routes:                                             │
│ POST   /crypto/create-payment                      │
│ GET    /crypto/payment-status/:id                  │
│ POST   /crypto/record-deposit (admin)             │
│ POST   /crypto/webhook (NOWPayments)              │
│ GET    /wallet                                      │
│ GET    /transactions                               │
│ GET    /payment-status/:id                        │
├─────────────────────────────────────────────────────┤
│ Services:                                           │
│ - walletService (balance, stats)                  │
│ - cryptoService (payments, webhook)               │
├─────────────────────────────────────────────────────┤
│ Repositories:                                       │
│ - transactionRepository                           │
│ - cryptoPaymentRepository                         │
│ - investmentRepository                            │
└─────────────────────────────────────────────────────┘
            ↓ (HTTP)
┌─────────────────────────────────────────────────────┐
│            NOWPayments API (Payment Gateway)         │
├─────────────────────────────────────────────────────┤
│ - Create payment invoice                           │
│ - Track payment status                            │
│ - Webhook notifications                           │
└─────────────────────────────────────────────────────┘
            ↓ (HTTP)
┌─────────────────────────────────────────────────────┐
│               PostgreSQL Database                    │
├─────────────────────────────────────────────────────┤
│ Tables:                                             │
│ - users                                             │
│ - transactions                                      │
│ - crypto_payments                                   │
│ - investments                                       │
└─────────────────────────────────────────────────────┘
```

## Installation & Setup

### 1. Backend Configuration

**Set environment variables in `.env`:**
```bash
# NOWPayments API Configuration
NOW_PAYMENTS_API_KEY=your_api_key_here
NOW_PAYMENTS_API_URL=https://api.nowpayments.io
NOW_PAYMENTS_IPN_SECRET=your_webhook_secret_here
NOW_PAYMENTS_IPN_CALLBACK_URL=https://yourdomain.com/crypto/webhook
NOW_PAYMENTS_SUCCESS_URL=https://yourdomain.com/dashboard/wallet?status=success
NOW_PAYMENTS_CANCEL_URL=https://yourdomain.com/dashboard/wallet?status=cancelled
```

**Get NOWPayments API Key:**
1. Go to https://nowpayments.io
2. Sign up / Log in
3. Go to Settings → API Keys
4. Create a new API key
5. Copy the key and IPN Secret

**Configure Webhook in NOWPayments:**
1. Go to Settings → Webhooks
2. Add webhook URL: `https://yourdomain.com/crypto/webhook`
3. Copy the IPN Secret

### 2. Database Setup

The database tables are already created by `schema.sql`. Make sure migrations are up to date:

```bash
cd backend
npm run db:migrate  # if using Prisma or similar
```

### 3. Frontend Setup

No additional setup needed. Components and hooks are already integrated.

## Usage

### User Flow: Add Funds

1. **Navigate to Dashboard or Wallet Page**
   - Click "Add Funds" button (green button at top right)

2. **Fill in Add Funds Modal**
   - Enter amount (₹500 - ₹1 crore)
   - Select crypto currency (BTC, ETH, USDT, USDC)
   - Or click preset amounts (₹5K, ₹10K, etc.)

3. **Submit Payment**
   - Click "Add ₹[amount]" button
   - Loading spinner shows payment initialization

4. **Complete Payment**
   - Success screen appears with payment link
   - Click "Open Payment Gateway"
   - New window opens to NOWPayments payment page
   - User completes payment with selected crypto

5. **Payment Confirmation**
   - NOWPayments sends webhook to backend
   - Backend validates signature
   - Transaction status updated to "completed"
   - Wallet balance automatically updated
   - Frontend payment status hook detects change
   - UI updates in real-time

### Admin Flow: Record Manual Deposit

```bash
curl -X POST https://yourdomain.com/crypto/record-deposit \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "description": "Bonus credit",
    "metadata": {"reason": "promo"}
  }'
```

Response:
```json
{
  "id": "uuid",
  "userId": "uuid",
  "type": "deposit",
  "amount": 5000,
  "status": "completed",
  "referenceType": "direct_deposit",
  "metadata": {"description": "Bonus credit", "reason": "promo"},
  "createdAt": "2024-01-01T00:00:00Z"
}
```

## API Reference

### Create Crypto Payment
```javascript
// Frontend
import { createCryptoPayment } from '@/lib/api/crypto';

const result = await createCryptoPayment(token, 5000, 'btc');
// Returns: { payment, payment_link }
```

### Check Payment Status
```javascript
import { usePaymentStatus } from '@/hooks/usePaymentStatus';

const { status, loading } = usePaymentStatus({
  token,
  paymentId: 'nowpayments-id',
  pollInterval: 5000
});
```

### Get Wallet Data
```javascript
import { useWalletData } from '@/hooks/useWalletData';

const { wallet, transactions, loading, refetch } = useWalletData({
  token,
  refetchInterval: 30000
});
```

## Transaction Types

| Type | Description | Creates | Amount |
|------|-------------|---------|--------|
| `deposit` | Wallet deposit | ✅ | +amount |
| `crypto_payment` | Crypto payment (pending) | ⏳ | pending |
| `investment` | Investment purchase | ✅ | -amount |
| `return` | Investment return | ✅ | +amount |
| `referral_bonus` | Referral reward | ✅ | +amount |
| `withdrawal` | Wallet withdrawal | ✅ | -amount |

## Error Handling

### Frontend Error States

```typescript
try {
  const payment = await createCryptoPayment(token, amount, currency);
} catch (error) {
  // error.message contains user-friendly error text
  if (error instanceof ApiRequestError) {
    console.log('Status:', error.statusCode);
  }
}
```

### Common Errors

| Error | Status | Cause |
|-------|--------|-------|
| Bad Request | 400 | Invalid amount (too low/high) |
| Unauthorized | 401 | Missing/invalid token |
| Forbidden | 403 | Insufficient permissions |
| Not Found | 404 | Payment not found |
| Rate Limit | 429 | Too many requests |

## Testing

### Test with curl

**Create Payment:**
```bash
curl -X POST http://localhost:5000/crypto/create-payment \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "pay_currency": "btc"}'
```

**Get Wallet:**
```bash
curl http://localhost:5000/wallet \
  -H "Authorization: Bearer TOKEN"
```

**Get Transactions:**
```bash
curl "http://localhost:5000/transactions?limit=10&offset=0" \
  -H "Authorization: Bearer TOKEN"
```

### Test Payment Status

```bash
curl http://localhost:5000/payment-status/PAYMENT_ID \
  -H "Authorization: Bearer TOKEN"
```

## Debugging

### Check Transaction in Database

```sql
-- Check user's transactions
SELECT * FROM transactions 
WHERE user_id = 'USER_ID' 
ORDER BY created_at DESC;

-- Check crypto payments
SELECT * FROM crypto_payments 
WHERE user_id = 'USER_ID' 
ORDER BY created_at DESC;

-- Check wallet balance
SELECT COALESCE(SUM(amount), 0) AS balance
FROM transactions
WHERE user_id = 'USER_ID' AND status = 'completed';
```

### Enable Webhook Logs

In backend, add logging to webhook handler:
```javascript
export async function handleWebhook(_rawBody, headers, payload) {
  console.log('Webhook received:', payload);
  // ... rest of logic
}
```

### Frontend Debugging

```typescript
// Enable payment status hook logging
const { status, error } = usePaymentStatus({ token, paymentId, pollInterval: 2000 });
useEffect(() => {
  console.log('Payment status:', status, error);
}, [status, error]);
```

## Performance Optimization

### Frontend Caching

Wallet data refetches every 30 seconds by default:
```typescript
// Reduce polling
useWalletData({ token, refetchInterval: 60000 }); // 60 seconds

// Disable polling
useWalletData({ token, refetchInterval: 0 });
```

### Payment Status Polling

Payment status checks every 5 seconds by default:
```typescript
// More frequent checks
usePaymentStatus({ token, paymentId, pollInterval: 2000 }); // 2 seconds

// Less frequent checks
usePaymentStatus({ token, paymentId, pollInterval: 10000 }); // 10 seconds
```

## Troubleshooting

### Payment Link Not Generated
- Check NOWPayments API key in .env
- Verify API credentials are correct
- Check if amount is within min/max limits

### Webhook Not Received
- Verify webhook URL is publicly accessible
- Check firewall/proxy settings
- Enable webhook logging in backend
- Test with NOWPayments test mode

### Wallet Balance Not Updating
- Check transaction status in database
- Verify webhook handler is processing correctly
- Check transaction amount matches payment amount
- Ensure transaction status changed to "completed"

### Payment Status Not Polling
- Check browser console for errors
- Verify token is still valid
- Check payment ID is correct
- Verify network requests in DevTools

## Security Checklist

✅ Token-based authentication on all endpoints
✅ Admin role verification for sensitive operations
✅ Webhook signature validation
✅ Rate limiting on payment endpoints
✅ Input validation on amounts
✅ Error messages don't leak sensitive info
✅ SQL injection prevention
✅ CORS properly configured

## Next Steps

1. **Test end-to-end in staging environment**
2. **Monitor webhook reliability**
3. **Set up payment failure alerts**
4. **Create user documentation**
5. **Plan for currency conversion (INR to USD)**
6. **Implement payment receipt/invoice**
7. **Add payment history export**
8. **Create admin dashboard for transactions**
