-- Create waitlist table for storing signups
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role_type TEXT NOT NULL,
  company TEXT,
  career_goals TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public waitlist signup)
CREATE POLICY "Anyone can join the waitlist"
ON public.waitlist
FOR INSERT
WITH CHECK (true);

-- Allow checking for duplicate emails
CREATE POLICY "Check for duplicate emails"
ON public.waitlist
FOR SELECT
USING (true);