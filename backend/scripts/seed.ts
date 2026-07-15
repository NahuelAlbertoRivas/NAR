import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';
import { Client } from 'pg';
import { parse } from 'pg-connection-string';

// ensure .env is loaded when running via tsx
const p = path.resolve(process.cwd(), '.env');
dotenv.config({ path: p });
console.log({ HAS_DATABASE_URL: Boolean(process.env.DATABASE_URL), HAS_DIRECT_URL: Boolean(process.env.DIRECT_URL) });

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
    // fallback to connection string (encode auth)
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
      // ignore
    }
    client = new Client({ connectionString: safeRaw, ssl: { rejectUnauthorized: false } });
  }

  try {
    await client.connect();
    console.log('Connected to DB, ensuring seed data...');

    const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM public.projects');
    if (rows[0]?.count === 0) {
      await client.query(`
        INSERT INTO public.projects (id, title, slug, short_description, published, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (id) DO NOTHING
      `, [
        'portfolio-seed',
        'Portfolio Profesional',
        'portfolio-profesional',
        'Proyecto base del portfolio conectado a Supabase.',
        true,
      ]);
      console.log('Seeded portfolio project.');
    } else {
      console.log('Seed existing, skipping.');
    }
  } catch (err: any) {
    console.error('Failed to seed DB:', err?.message ?? err);
    process.exit(1);
  } finally {
    await client.end().catch(() => undefined);
  }
}

run();
