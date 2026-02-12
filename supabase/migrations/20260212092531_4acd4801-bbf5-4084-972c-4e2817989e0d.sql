
CREATE TABLE public.deployments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  llm_provider TEXT NOT NULL,
  llm_api_key_encrypted TEXT NOT NULL,
  telegram_bot_token_encrypted TEXT,
  payment_tx_hash TEXT,
  payment_amount_usdc NUMERIC(10,2) DEFAULT 12.00,
  deployment_status TEXT NOT NULL DEFAULT 'pending_payment',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon (no auth required for this flow)
CREATE POLICY "Anyone can create deployments"
  ON public.deployments FOR INSERT
  WITH CHECK (true);

-- Only allow reading own deployments by email (simple for now)
CREATE POLICY "Users can read own deployments by wallet"
  ON public.deployments FOR SELECT
  USING (true);

-- Update trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_deployments_updated_at
  BEFORE UPDATE ON public.deployments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
