import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { Client } from 'pg';

async function getClient() {
  const raw = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!raw) {
    console.error('No DATABASE_URL/DIRECT_URL in env');
    process.exit(1);
  }
  // attempt to create client directly; if connection string contains unencoded chars
  // ensure auth section is URL-encoded
  let safeRaw = raw;
  try {
    const m = raw.match(/^(postgres(?:ql)?:\/\/)(.+)$/i);
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

  return new Client({ connectionString: safeRaw, ssl: { rejectUnauthorized: false } });
}

async function run() {
  // load frontend data
  const dataPath = path.resolve(process.cwd(), '../frontend/src/data/index.ts');
  const { pathToFileURL } = await import('url');
  const dataUrl = pathToFileURL(dataPath).href;
  let mod;
  try {
    mod = await import(dataUrl);
  } catch (e) {
    console.error('Failed to import frontend data from', dataPath, e?.message ?? e);
    process.exit(1);
  }

  const projects = mod.projects ?? [];
  const articles = mod.articles ?? [];

  const client = await getClient();
  try {
    await client.connect();
    console.log('Connected to DB — seeding projects and articles...');

    for (const p of projects) {
      const slug = p.id ?? (p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const query = `
        INSERT INTO public.projects (
          id, title, slug, short_description, description, problem, architecture, solution, results,
          technologies, languages, frameworks, category, status, year, featured, image, github, demo,
          screenshots, timeline, challenges, metrics, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          short_description = EXCLUDED.short_description,
          description = EXCLUDED.description,
          problem = EXCLUDED.problem,
          architecture = EXCLUDED.architecture,
          solution = EXCLUDED.solution,
          results = EXCLUDED.results,
          technologies = EXCLUDED.technologies,
          languages = EXCLUDED.languages,
          frameworks = EXCLUDED.frameworks,
          category = EXCLUDED.category,
          status = EXCLUDED.status,
          year = EXCLUDED.year,
          featured = EXCLUDED.featured,
          image = EXCLUDED.image,
          github = EXCLUDED.github,
          demo = EXCLUDED.demo,
          screenshots = EXCLUDED.screenshots,
          timeline = EXCLUDED.timeline,
          challenges = EXCLUDED.challenges,
          metrics = EXCLUDED.metrics,
          updated_at = NOW();
      `;

      const vals = [
        p.id,
        p.title,
        slug,
        p.shortDescription ?? p.short_description ?? null,
        p.description ?? null,
        p.problem ?? null,
        p.architecture ?? null,
        p.solution ?? null,
        p.results ?? null,
        JSON.stringify(p.technologies ?? []),
        JSON.stringify(p.languages ?? []),
        JSON.stringify(p.frameworks ?? []),
        p.category ?? null,
        p.status ?? null,
        p.year ?? null,
        p.featured === true,
        p.image ?? null,
        p.github ?? null,
        p.demo ?? null,
        JSON.stringify(p.screenshots ?? []),
        JSON.stringify(p.timeline ?? []),
        JSON.stringify(p.challenges ?? []),
        JSON.stringify(p.metrics ?? null),
      ];

      await client.query(query, vals);
      console.log('Upserted project', p.id);
    }

    for (const a of articles) {
      const slug = a.id ?? (a.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const q = `
        INSERT INTO public.articles (
          id, title, slug, short_description, description, read_time, tags, date, url, image, featured, category, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW(),NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          slug = EXCLUDED.slug,
          short_description = EXCLUDED.short_description,
          description = EXCLUDED.description,
          read_time = EXCLUDED.read_time,
          tags = EXCLUDED.tags,
          date = EXCLUDED.date,
          url = EXCLUDED.url,
          image = EXCLUDED.image,
          featured = EXCLUDED.featured,
          category = EXCLUDED.category,
          updated_at = NOW();
      `;
      const vals = [
        a.id,
        a.title,
        slug,
        a.summary ?? a.short_description ?? null,
        a.description ?? null,
        a.readTime ?? a.read_time ?? null,
        JSON.stringify(a.tags ?? []),
        a.date ?? null,
        a.url ?? null,
        a.image ?? null,
        a.featured === true,
        a.category ?? null,
      ];

      await client.query(q, vals);
      console.log('Upserted article', a.id);
    }

    console.log('Seeding complete.');
  } catch (err: any) {
    console.error('Seeding failed:', err?.message ?? err);
    process.exit(1);
  } finally {
    await client.end().catch(() => undefined);
  }
}

run();
