-- 2026-07-15 0001: Ensure full schema for portfolio application
-- Idempotent migration suitable for Supabase or manual execution via DIRECT_URL

BEGIN;
SET LOCAL search_path = public;

-- projects table
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

-- articles table
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

-- tech_stack table
CREATE TABLE IF NOT EXISTS public.tech_stack (
  name text PRIMARY KEY,
  category text,
  icon text,
  level integer
);

-- contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  submitted_at timestamptz DEFAULT now()
);

-- Ensure any missing columns exist (idempotent)
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS slug text,
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
  ADD COLUMN IF NOT EXISTS metrics jsonb,
  ADD COLUMN IF NOT EXISTS tags jsonb,
  ADD COLUMN IF NOT EXISTS read_time integer,
  ADD COLUMN IF NOT EXISTS date text,
  ADD COLUMN IF NOT EXISTS url text,
  ADD COLUMN IF NOT EXISTS published boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS read_time integer,
  ADD COLUMN IF NOT EXISTS tags jsonb,
  ADD COLUMN IF NOT EXISTS image text,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- Optional: ensure indexes for common lookups (non-unique slugs)
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects (slug);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles (slug);

COMMIT;

-- Notes:
-- - This file is intentionally idempotent: safe to run multiple times.
-- - To apply manually with DIRECT_URL:
--     psql "${DIRECT_URL}" -f backend/migrations/2026-07-15-0001__ensure_full_schema.sql
-- - To apply via Supabase: create a new SQL migration in your Supabase project and paste the contents, or use your preferred migration tool.
