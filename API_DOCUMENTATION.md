# Investment Platform API Documentation

## Wallet APIs

### Get Wallet Balance & Statistics
- **Endpoint:** `GET /wallet`
- **Auth:** Bearer token required
- **Description:** Get user's wallet balance, total invested, total returns, and available balance
- **Response:**
```json
{
  "balance": 50000,
  "totalInvested": 30000,
  "totalReturns": 5000,
  "availableBalance": 20000
}
```

### Get Transaction History
- **Endpoint:** `GET /transactions?limit=50&offset=0`
- **Auth:** Bearer token required
- **Query Params:**
  - `limit` (optional, default: 50, max: 100) - Number of transactions per page
  - `offset` (optional, default: 0) - Pagination offset
- **Description:** Get paginated transaction history for the user
- **Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "deposit|withdrawal|investment|return|referral_bonus|crypto_payment",
      "amount": 5000,
      "status": "completed|pending|failed|cancelled",
      "description": "Transaction description",
      "metadata": {},
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100
}
```

### Get Payment Status
- **Endpoint:** `GET /payment-status/:paymentId`
- **Auth:** Bearer token required
- **Description:** Check the status of a specific payment
- **Response:**
```json
{
  "id": "uuid",
  "paymentId": "nowpayments-id",
  "payAddress": "0x...",
  "paymentUrl": "https://...",
  "priceAmount": 100,
  "priceCurrency": "usd",
  "payCurrency": "btc",
  "status": "waiting|confirming|confirmed|finished|failed|expired|refunded",
  "transactionStatus": "pending|completed|failed",
  "amount": 5000,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

## Crypto Payment APIs

### Create Crypto Payment
- **Endpoint:** `POST /crypto/create-payment`
- **Auth:** Bearer token required
- **Body:**
```json
{
  "amount": 5000,
  "pay_currency": "btc"
}
```
- **Description:** Initiate a new crypto payment for wallet deposit
- **Supported currencies:** btc, eth, usdt, usdc, bnb, xrp, etc.
- **Response:**
```json
{
  "payment": {
    "id": "uuid",
    "userId": "uuid",
    "paymentId": "nowpayments-id",
    "payAddress": "0x...",
    "paymentUrl": "https://payment-gateway-url",
    "priceAmount": 100,
    "priceCurrency": "usd",
    "payCurrency": "btc",
    "status": "waiting"
  },
  "payment_link": "https://payment-gateway-url"
}
```

### Get Crypto Payment Status
- **Endpoint:** `GET /crypto/payment-status/:paymentId`
- **Auth:** Bearer token required
- **Description:** Check the status of a crypto payment
- **Response:** (Same as Get Payment Status above)

### Record Direct Deposit (Admin Only)
- **Endpoint:** `POST /crypto/record-deposit`
- **Auth:** Bearer token (admin) required
- **Body:**
```json
{
  "amount": 5000,
  "description": "Manual deposit",
  "metadata": {}
}
```
- **Description:** Record a direct wallet deposit (for admin/system use)
- **Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "type": "deposit",
  "amount": 5000,
  "status": "completed",
  "referenceType": "direct_deposit",
  "metadata": { "description": "Manual deposit" },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Webhook Endpoint
- **Endpoint:** `POST /crypto/webhook`
- **Auth:** Signature verification (x-nowpayments-sig header)
- **Description:** Receives payment confirmation from NOWPayments
- **Automated Actions:**
  - Updates payment status
  - Creates/completes transaction
  - Credits user's wallet automatically

---

## Transaction Types

| Type | Description | Debit/Credit |
|------|-------------|---|
| `deposit` | Wallet deposit (manual or crypto) | Credit (+) |
| `crypto_payment` | Pending crypto payment | Debit (-) on completion |
| `investment` | Investment purchase | Debit (-) |
| `return` | Investment return/profit | Credit (+) |
| `referral_bonus` | Referral reward | Credit (+) |
| `withdrawal` | Wallet withdrawal | Debit (-) |

## Transaction Statuses

| Status | Description |
|--------|-------------|
| `pending` | Transaction in progress |
| `completed` | Transaction successful |
| `failed` | Transaction failed |
| `cancelled` | Transaction cancelled |

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

**Common Error Codes:**
- `VALIDATION_ERROR` - Invalid request data
- `UNAUTHORIZED` - Missing or invalid token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

---

## Frontend Hooks

### useWalletData
Auto-fetch wallet and transaction data with polling

```typescript
const { wallet, transactions, loading, error, refetch } = useWalletData({
  token,
  enabled: true,
  refetchInterval: 30000, // 30 seconds
  transactionLimit: 50,
  transactionOffset: 0
});
```

### usePaymentStatus
Monitor crypto payment status with polling

```typescript
const { status, loading, error, refetch } = usePaymentStatus({
  token,
  paymentId: 'nowpayments-id',
  pollInterval: 5000 // 5 seconds
});
```

---

## Frontend API Clients

### Wallet API (`@/lib/api/wallet`)
- `getWallet(token)` - Get wallet balance and stats
- `getTransactions(token, limit?, offset?)` - Get transaction history
- `getPaymentStatus(token, paymentId)` - Get payment status

### Crypto API (`@/lib/api/crypto`)
- `createCryptoPayment(token, amount, payCurrency)` - Create crypto payment
- `getPaymentStatus(token, paymentId)` - Get crypto payment status

---

## Integration Flow

### Add Funds Flow
1. User clicks "Add Funds" button
2. Opens AddFundsModal component
3. User selects amount and crypto currency
4. Submits form → calls `createCryptoPayment(token, amount, currency)`
5. Backend creates crypto payment via NOWPayments API
6. Returns payment link and payment ID
7. Modal displays success state with payment gateway link
8. User opens payment gateway in new window
9. User completes payment
10. NOWPayments sends webhook confirmation
11. Backend updates payment status and credits wallet
12. Frontend can poll `usePaymentStatus` hook for real-time updates

### Wallet Display Flow
1. Dashboard/Wallet page loads
2. Calls `useWalletData` hook which fetches wallet and transactions
3. Displays balance, invested amount, returns
4. Shows transaction history with pagination
5. Hook automatically refetches every 30 seconds
6. User can manually refresh via "Refetch" button

---

## Environment Variables Required

Backend needs:
```env
NOW_PAYMENTS_API_KEY=your_api_key
NOW_PAYMENTS_API_URL=https://api.nowpayments.io
NOW_PAYMENTS_IPN_SECRET=your_webhook_secret
NOW_PAYMENTS_IPN_CALLBACK_URL=https://yourserver.com/crypto/webhook
NOW_PAYMENTS_SUCCESS_URL=https://yoursite.com/dashboard/wallet?status=success
NOW_PAYMENTS_CANCEL_URL=https://yoursite.com/dashboard/wallet?status=cancelled
```

---

## Testing Endpoints

### Test Wallet Fetch
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/wallet
```

### Test Transaction History
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:5000/transactions?limit=10&offset=0"
```

### Test Create Crypto Payment
```bash
curl -X POST -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000, "pay_currency": "btc"}' \
  http://localhost:5000/crypto/create-payment
```

---

## Performance Notes

- Wallet data is cached in frontend with 30-second refetch interval
- Transactions use pagination (max 100 per request)
- Payment status checks use 5-second polling (configurable)
- All endpoints are rate-limited for security
- Crypto payment creation uses sensitive rate limiter
