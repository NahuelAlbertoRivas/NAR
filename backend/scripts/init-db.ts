import 'dotenv/config';
import { Client } from 'pg';
import { parse } from 'pg-connection-string';
import { promises as fs } from 'fs';

function parseConnection(raw?: string) {
  if (!raw) return null;
  try {
    return parse(raw);
  } catch {
    return null;
  }
}

async function run() {
  const raw = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  const cfg = parseConnection(raw);
  if (!cfg) {
    console.error('No valid DATABASE_URL/DIRECT_URL found in env');
    process.exit(1);
  }

  const client = new Client({
    host: cfg.host,
    port: Number(cfg.port || 5432),
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    ssl: cfg.ssl === 'true' || cfg.ssl === true ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await client.connect();
    console.log('Connected to DB, creating tables...');

    await client.query(`
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
    `);

    await client.query(`
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
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.tech_stack (
        name text PRIMARY KEY,
        category text,
        icon text,
        level integer
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.contacts (
        id text PRIMARY KEY,
        name text NOT NULL,
        email text NOT NULL,
        subject text NOT NULL,
        message text NOT NULL,
        submitted_at timestamptz DEFAULT now()
      );
    `);

    console.log('Tables created (if missing).');
  } catch (err: any) {
    console.error('Failed to initialize DB schema:', err?.message ?? err);
    process.exit(1);
  } finally {
    await client.end().catch(() => undefined);
  }
}

run();
