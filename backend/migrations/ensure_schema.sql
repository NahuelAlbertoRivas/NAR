-- Migration script to ensure schema matches frontend models
-- Run this on target Postgres (e.g., Supabase) to create/ensure tables and columns

CREATE TABLE IF NOT EXISTS public.projects (
  id text PRIMARY KEY,
  title text NOT NULL,
  slug text,
  short_description text,
  description text,
  problem text,
  architecture text,
  solution text,
  results text,
  technologies jsonb,
  languages jsonb,
  frameworks jsonb,
  category text,
  status text,
  year integer,
  featured boolean DEFAULT false,
  image text,
  github text,
  demo text,
  screenshots jsonb,
  timeline jsonb,
  challenges jsonb,
  metrics jsonb,
  tags jsonb,
  read_time integer,
  date text,
  url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.articles (
  id text PRIMARY KEY,
  title text NOT NULL,
  slug text,
  short_description text,
  description text,
  read_time integer,
  tags jsonb,
  date text,
  url text,
  image text,
  featured boolean DEFAULT false,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.tech_stack (
  name text PRIMARY KEY,
  category text,
  icon text,
  level integer
);

CREATE TABLE IF NOT EXISTS public.contacts (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

-- Add any missing columns (idempotent)
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS problem text,
  ADD COLUMN IF NOT EXISTS architecture text,
  ADD COLUMN IF NOT EXISTS solution text,
  ADD COLUMN IF NOT EXISTS results text,
  ADD COLUMN IF NOT EXISTS technologies jsonb,
  ADD COLUMN IF NOT EXISTS languages jsonb,
  ADD COLUMN IF NOT EXISTS frameworks jsonb,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS status text,
  ADD COLUMN IF NOT EXISTS year integer,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS image text,
  ADD COLUMN IF NOT EXISTS github text,
  ADD COLUMN IF NOT EXISTS demo text,
  ADD COLUMN IF NOT EXISTS screenshots jsonb,
  ADD COLUMN IF NOT EXISTS timeline jsonb,
  ADD COLUMN IF NOT EXISTS challenges jsonb,
  ADD COLUMN IF NOT EXISTS metrics jsonb;

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS read_time integer,
  ADD COLUMN IF NOT EXISTS tags jsonb,
  ADD COLUMN IF NOT EXISTS image text,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS category text;

-- End of migration
