import { Client } from 'pg';
import { env } from '../config/env';
import { lookup as dnsLookup } from 'dns/promises';

function parseConnectionDetails(rawUrl?: string): { host: string; port: number; database: string; user: string; password: string; ssl: boolean | { rejectUnauthorized: boolean } } | null {
  if (!rawUrl) return null;

  try {
    const u = new URL(rawUrl);
    if (!u.protocol.startsWith('postgres')) return null;

    const host = u.hostname; // handles IPv6 bracketed hosts
    const port = Number(u.port || 5432);
    const database = (u.pathname || '').replace(/^\//, '') || 'postgres';
    const user = u.username || '';
    const password = u.password || '';
    const sslMode = u.searchParams.get('sslmode');

    return {
      host,
      port,
      database,
      user,
      password,
      ssl: sslMode === 'disable' ? false : { rejectUnauthorized: false },
    };
  } catch {
    // fallback to legacy parsing for non-URL shapes
  }

  // legacy fallback (best-effort)
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith('postgres://') && !trimmed.startsWith('postgresql://')) {
    return null;
  }

  const protocol = trimmed.startsWith('postgresql://') ? 'postgresql://' : 'postgres://';
  const withoutProtocol = trimmed.slice(protocol.length);
  const atIndex = withoutProtocol.lastIndexOf('@');
  if (atIndex === -1) return null;

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

  let connectionDetails = parseConnectionDetails(process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '');
  if (!connectionDetails) {
    return;
  }

  // Prefer IPv4 resolution to avoid ENETUNREACH on environments without IPv6.
  try {
    // Only attempt lookup when host looks like a DNS name (not literal IP)
    if (!/^\[?[:0-9a-fA-F]+\]?$/.test(connectionDetails.host)) {
      const lookupResult = await dnsLookup(connectionDetails.host, { family: 4 });
      if (lookupResult && lookupResult.address) {
        connectionDetails = { ...connectionDetails, host: lookupResult.address };
      }
    }
  } catch (err) {
    // If DNS lookup fails, continue with original host; schema init will skip on connection errors.
  }

  console.log('DB schema init: connecting to', connectionDetails.host, 'port', connectionDetails.port);
  const client = new Client(connectionDetails);

  try {
    try {
      await client.connect();
    } catch (connErr: any) {
      // If the initial connect failed due to IPv6/unreachable network, try IPv4 lookup and reconnect once.
      if (connErr && (connErr.code === 'ENETUNREACH' || connErr.code === 'EADDRNOTAVAIL' || connErr.code === 'EAI_AGAIN')) {
        try {
          const lookupResult = await dnsLookup(connectionDetails.host, { family: 4 });
          if (lookupResult && lookupResult.address) {
            connectionDetails.host = lookupResult.address;
            console.warn('DB schema init: retrying connect with IPv4 address', connectionDetails.host);
            await client.end().catch(() => undefined);
            // create new client with updated host
            const client2 = new Client(connectionDetails);
            await client2.connect();
            // swap client reference so subsequent queries use connected client
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (client as any) = client2;
          } else {
            throw connErr;
          }
        } catch (retryErr) {
          throw retryErr;
        }
      } else {
        throw connErr;
      }
    }

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
