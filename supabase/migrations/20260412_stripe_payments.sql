-- ═══════════════════════════════════════════════════════════
-- VOICE³ — Stripe Payment Integration
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. Add Stripe columns to profiles (if not exist)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS sessions_remaining integer DEFAULT 0;

-- 2. Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pack text NOT NULL,
  amount integer, -- in cents
  currency text DEFAULT 'eur',
  stripe_session_id text,
  stripe_payment_intent text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies for payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert payments"
  ON payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update payments"
  ON payments FOR UPDATE
  USING (true);

-- 5. Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);
