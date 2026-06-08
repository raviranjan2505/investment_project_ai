# Investment + Referral + Crypto Payment + AI Backend

Node.js + Express.js backend using PostgreSQL, JWT httpOnly cookies, NOWPayments webhooks, scheduled investment settlement, and OpenAI-powered AI endpoints.

## Setup

```bash
cd backend
npm install
cp .env .env.local # optional, edit secrets
npm run db:schema
npm run dev
```

The API runs on `http://localhost:5000` by default.

## Important Environment Variables

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: long random signing secret.
- `OPENAI_API_KEY`: OpenAI API key for AI routes.
- `NOWPAYMENTS_API_KEY`: NOWPayments API key.
- `NOWPAYMENTS_IPN_SECRET`: NOWPayments webhook signature secret.
- `CLIENT_ORIGIN`: frontend origin allowed by CORS.

## Core Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/plans`
- `POST /api/invest/basic`
- `POST /api/invest/silver`
- `POST /api/invest/gold`
- `POST /api/invest/platinum`
- `GET /api/investments`
- `GET /api/wallet`
- `GET /api/transactions`
- `POST /api/crypto/create-payment`
- `POST /api/crypto/webhook`
- `POST /api/withdraw`
- `GET /api/withdrawals`
- `POST /api/ai/chat`
- `POST /api/ai/fraud-check`
- `GET /api/ai/suggest-plan`

## Security Notes

- Wallet balances are derived only from transaction rows.
- JWTs are stored as httpOnly cookies.
- All SQL uses parameterized `pg` queries.
- NOWPayments webhooks verify HMAC signature and reject replayed event IDs.
- Sensitive endpoints are rate limited.
