import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';

// Try to explicitly load .env from common locations to make this script robust
const candidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '../.env'),
];
let loaded = false;
for (const p of candidates) {
  try {
    const res = dotenv.config({ path: p });
    if (res.parsed) {
      console.log(`Loaded .env from ${p}`);
      loaded = true;
      break;
    }
  } catch (e) {
    // ignore
  }
}
if (!loaded) {
  console.log('No .env file loaded from known locations (continuing, will use environment variables)');
}

// Diagnostic: show presence (not values) of key env vars
console.log({
  HAS_DATABASE_URL: Boolean(process.env.DATABASE_URL),
  HAS_DIRECT_URL: Boolean(process.env.DIRECT_URL),
});
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
  if (!raw) {
    console.error('No DATABASE_URL or DIRECT_URL provided in environment');
    process.exit(1);
  }

  let client: Client;
  if (cfg) {
    client = new Client({
      host: cfg.host,
      port: Number(cfg.port || 5432),
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      ssl: cfg.ssl === 'true' || cfg.ssl === true ? { rejectUnauthorized: false } : undefined,
    });
  } else {
    // Fall back to passing the raw connection string directly (handles passwords with special chars)
    // Some connection strings include special characters that are not URL-encoded;
    // attempt to encode the user:password section to avoid decodeURIComponent errors.
    let safeRaw = raw || '';
    try {
      const m = safeRaw.match(/^(postgres(?:ql)?:\/\/)(.+)$/i);
      if (m) {
        const protocol = m[1];
        const rest = m[2];
        const atIndex = rest.lastIndexOf('@');
        if (atIndex > -1) {
          const auth = rest.slice(0, atIndex);
          const host = rest.slice(atIndex + 1);
          const colonIndex = auth.indexOf(':');
          if (colonIndex > -1) {
            const user = auth.slice(0, colonIndex);
            const pass = auth.slice(colonIndex + 1);
            const safeAuth = `${encodeURIComponent(user)}:${encodeURIComponent(pass)}`;
            safeRaw = protocol + safeAuth + '@' + host;
          }
        }
      }
    } catch (e) {
      // ignore and use original raw
    }

    client = new Client({ connectionString: safeRaw, ssl: { rejectUnauthorized: false } });
  }

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
