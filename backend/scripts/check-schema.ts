import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';
import { Client } from 'pg';
import { parse } from 'pg-connection-string';

// load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
console.log({ HAS_DATABASE_URL: Boolean(process.env.DATABASE_URL), HAS_DIRECT_URL: Boolean(process.env.DIRECT_URL) });

function parseConnection(raw?: string) {
  if (!raw) return null;
  try {
    return parse(raw);
  } catch {
    return null;
  }
}

async function getClient() {
  const raw = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  const cfg = parseConnection(raw);
  if (!raw) {
    console.error('No DATABASE_URL or DIRECT_URL provided in environment');
    process.exit(1);
  }

  if (cfg) {
    return new Client({
      host: cfg.host,
      port: Number(cfg.port || 5432),
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      ssl: cfg.ssl === 'true' || cfg.ssl === true ? { rejectUnauthorized: false } : undefined,
    });
  }

  // fallback: try to encode auth section if present
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

  return new Client({ connectionString: safeRaw, ssl: { rejectUnauthorized: false } });
}

async function run() {
  const client = await getClient();
  try {
    await client.connect();
    console.log('Connected to DB — checking schema...');

    const projExpected = [
      'id','title','short_description','description','problem','architecture','solution','results',
      'technologies','languages','frameworks','category','status','year','featured','image','github','demo',
      'screenshots','timeline','challenges','metrics'
    ];

    const articleExpected = [
      'id','title','short_description','read_time','tags','date','url','image','featured','category'
    ];

    async function getCols(table: string) {
      const res = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1;
      `, [table]);
      return res.rows.map((r: any) => r.column_name);
    }

    const projCols = await getCols('projects');
    const artCols = await getCols('articles');

    const missingProj = projExpected.filter(c => !projCols.includes(c));
    const missingArt = articleExpected.filter(c => !artCols.includes(c));

    console.log('projects columns present:', projCols.sort());
    console.log('articles columns present:', artCols.sort());

    if (missingProj.length === 0 && missingArt.length === 0) {
      console.log('All expected columns present for projects and articles.');
      return;
    }

    console.log('Missing project columns:', missingProj);
    console.log('Missing article columns:', missingArt);

    // Add missing columns with reasonable defaults/types
    for (const col of missingProj) {
      let sql = `ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS ${col} text;`;
      if (['technologies','languages','frameworks','screenshots','timeline','challenges','metrics'].includes(col)) {
        sql = `ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS ${col} jsonb;`;
      } else if (col === 'featured') {
        sql = `ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;`;
      } else if (col === 'year') {
        sql = `ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS year integer;`;
      }
      console.log('Executing:', sql);
      await client.query(sql);
    }

    for (const col of missingArt) {
      let sql = `ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS ${col} text;`;
      if (['tags'].includes(col)) sql = `ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS tags jsonb;`;
      else if (col === 'read_time') sql = `ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS read_time integer;`;
      else if (col === 'featured') sql = `ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;`;
      console.log('Executing:', sql);
      await client.query(sql);
    }

    console.log('Schema correction completed. Re-checking...');
    const projCols2 = await getCols('projects');
    const artCols2 = await getCols('articles');
    console.log('projects columns now:', projCols2.sort());
    console.log('articles columns now:', artCols2.sort());
  } catch (err: any) {
    console.error('Schema check failed:', err?.message ?? err);
    process.exit(1);
  } finally {
    await client.end().catch(() => undefined);
  }
}

run();
