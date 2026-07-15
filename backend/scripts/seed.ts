import 'dotenv/config';
import { Client } from 'pg';
import { parse } from 'pg-connection-string';

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
