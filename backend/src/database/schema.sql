CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE investment_status AS ENUM ('active', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_type AS ENUM ('deposit', 'investment', 'return', 'referral_bonus', 'withdrawal', 'crypto_payment');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE crypto_payment_status AS ENUM ('waiting', 'confirming', 'confirmed', 'finished', 'failed', 'expired', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  referral_code VARCHAR(32) NOT NULL UNIQUE,
  referred_by UUID REFERENCES users(id) ON DELETE SET NULL,
  role user_role NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  min_amount NUMERIC(18,2) NOT NULL CHECK (min_amount > 0),
  max_amount NUMERIC(18,2) NOT NULL CHECK (max_amount >= min_amount),
  return_rate NUMERIC(8,2) NOT NULL CHECK (return_rate >= 0),
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  referral_bonus_rate NUMERIC(8,2) NOT NULL DEFAULT 5 CHECK (referral_bonus_rate >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  amount NUMERIC(18,2) NOT NULL CHECK (amount > 0),
  return_rate NUMERIC(8,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  expected_return NUMERIC(18,2) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  status investment_status NOT NULL DEFAULT 'active',
  referral_bonus_paid BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount NUMERIC(18,2) NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  reference_type VARCHAR(80),
  reference_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference_type, reference_id);

CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(18,2) NOT NULL CHECK (amount > 0),
  method VARCHAR(80) NOT NULL,
  destination TEXT NOT NULL,
  status withdrawal_status NOT NULL DEFAULT 'pending',
  transaction_id UUID REFERENCES transactions(id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS crypto_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_id VARCHAR(120) NOT NULL UNIQUE,
  pay_address TEXT,
  payment_url TEXT,
  price_amount NUMERIC(18,2) NOT NULL CHECK (price_amount > 0),
  price_currency VARCHAR(20) NOT NULL DEFAULT 'usd',
  pay_currency VARCHAR(20) NOT NULL,
  status crypto_payment_status NOT NULL DEFAULT 'waiting',
  transaction_id UUID REFERENCES transactions(id),
  webhook_event_ids TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO plans (slug, name, min_amount, max_amount, return_rate, duration_days, referral_bonus_rate)
VALUES
  ('basic', 'Basic', 50, 999.99, 8, 30, 3),
  ('silver', 'Silver', 1000, 4999.99, 12, 45, 5),
  ('gold', 'Gold', 5000, 19999.99, 18, 60, 7),
  ('platinum', 'Platinum', 20000, 100000, 25, 90, 10)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  min_amount = EXCLUDED.min_amount,
  max_amount = EXCLUDED.max_amount,
  return_rate = EXCLUDED.return_rate,
  duration_days = EXCLUDED.duration_days,
  referral_bonus_rate = EXCLUDED.referral_bonus_rate,
  is_active = TRUE;
