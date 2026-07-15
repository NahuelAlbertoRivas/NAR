import { Client } from 'pg';
import { env } from '../config/env';

function parseConnectionDetails(rawUrl?: string): { host: string; port: number; database: string; user: string; password: string; ssl: boolean | { rejectUnauthorized: boolean } } | null {
  if (!rawUrl) {
    return null;
  }

  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith('postgres://') && !trimmed.startsWith('postgresql://')) {
    return null;
  }

  const protocol = trimmed.startsWith('postgresql://') ? 'postgresql://' : 'postgres://';
  const withoutProtocol = trimmed.slice(protocol.length);
  const atIndex = withoutProtocol.lastIndexOf('@');
  if (atIndex === -1) {
    return null;
  }

  const authPart = withoutProtocol.slice(0, atIndex);
  const hostAndDatabasePart = withoutProtocol.slice(atIndex + 1);
  const questionIndex = hostAndDatabasePart.indexOf('?');
  const rawHostAndDatabase = questionIndex >= 0 ? hostAndDatabasePart.slice(0, questionIndex) : hostAndDatabasePart;
  const query = questionIndex >= 0 ? hostAndDatabasePart.slice(questionIndex + 1) : '';
  const queryParams = new URLSearchParams(query);
  const slashIndex = rawHostAndDatabase.indexOf('/');
  const hostPort = slashIndex >= 0 ? rawHostAndDatabase.slice(0, slashIndex) : rawHostAndDatabase;
  const database = slashIndex >= 0 ? rawHostAndDatabase.slice(slashIndex + 1) : 'postgres';
  const authDividerIndex = authPart.indexOf(':');
  const username = authDividerIndex >= 0 ? authPart.slice(0, authDividerIndex) : authPart;
  const password = authDividerIndex >= 0 ? authPart.slice(authDividerIndex + 1) : '';
  const [host, portPart] = hostPort.split(':');

  return {
    host,
    port: Number(portPart || 5432),
    database,
    user: username,
    password,
    ssl: queryParams.get('sslmode') === 'disable' ? false : { rejectUnauthorized: false },
  };
}

export async function ensureDatabaseSchema(): Promise<void> {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return;
  }

  const connectionDetails = parseConnectionDetails(process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '');
  if (!connectionDetails) {
    return;
  }

  const client = new Client(connectionDetails);

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.projects (
        id text PRIMARY KEY,
        title text NOT NULL,
        slug text NOT NULL,
        short_description text,
        published boolean DEFAULT false,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz
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
    }
  } catch (error) {
    console.warn('Supabase schema initialization skipped:', error);
  } finally {
    await client.end().catch(() => undefined);
  }
}
