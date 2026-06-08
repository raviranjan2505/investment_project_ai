import dotenv from 'dotenv';

dotenv.config();

const required = ['DATABASE_URL', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  nowPaymentsApiKey: process.env.NOWPAYMENTS_API_KEY || '',
  nowPaymentsIpnSecret: process.env.NOWPAYMENTS_IPN_SECRET || '',
  nowPaymentsApiUrl: process.env.NOWPAYMENTS_API_URL || 'https://api.nowpayments.io/v1',
  nowPaymentsIpnCallbackUrl: process.env.NOWPAYMENTS_IPN_CALLBACK_URL || '',
  nowPaymentsSuccessUrl: process.env.NOWPAYMENTS_SUCCESS_URL || '',
  nowPaymentsCancelUrl: process.env.NOWPAYMENTS_CANCEL_URL || '',
  isProduction: process.env.NODE_ENV === 'production'
};
