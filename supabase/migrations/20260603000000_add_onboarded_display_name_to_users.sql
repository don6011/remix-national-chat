-- Add onboarded tracking and display_name to users table
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS onboarded BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS display_name TEXT;
