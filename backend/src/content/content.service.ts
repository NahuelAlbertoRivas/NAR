import { Injectable } from '@nestjs/common';
import { supabase } from '../database/supabase.client';

export interface ArticleRecord {
  id: string;
  title: string;
  slug?: string;
  summary?: string;
  description?: string;
  readTime?: number;
  tags?: string[] | unknown;
  date?: string;
  url?: string;
  image?: string;
  featured?: boolean;
  category?: string;
  author?: string;
  [key: string]: unknown;
}

export interface TechStackItem {
  name: string;
  category: string;
  icon: string;
  level: number;
}

@Injectable()
export class ContentService {
  private readonly fallbackArticles: ArticleRecord[] = [
    {
      id: 'distributed-transactions',
      title: 'Transacciones Distribuidas en Microservicios: Sagas y Outbox Pattern',
      summary:
        'Cómo garantizar consistencia eventual en arquitecturas de microservicios sin two-phase commit. Un análisis profundo del patrón Saga coreografiado vs orquestado y la implementación del Outbox Pattern con Debezium.',
      readTime: 12,
      tags: ['Microservicios', 'Java', 'Spring Boot', 'Arquitectura'],
      date: '2024-11-15',
    },
    {
      id: 'llm-production',
      title: 'Llevar LLMs a Producción: Lecciones Aprendidas',
      summary:
        'Reflexiones prácticas sobre desafíos reales al operar modelos de lenguaje en entornos enterprise: latencia, costos, hallucinations, y cómo construir guardrails efectivos sin sacrificar utilidad.',
      readTime: 8,
      tags: ['IA', 'LLM', 'Python', 'MLOps'],
      date: '2024-09-20',
    },
  ];

  private readonly fallbackTechStack: TechStackItem[] = [
    { name: 'Java', category: 'Lenguaje', icon: '☕', level: 80 },
    { name: 'C++/C', category: 'Lenguaje', icon: '𝐂++', level: 80 },
    { name: 'Python', category: 'Lenguaje', icon: '🐍', level: 60 },
    { name: 'Prolog', category: 'Lenguaje', icon: '📜', level: 40 },
    { name: 'Haskell', category: 'Lenguaje', icon: 'λ', level: 40 },
    { name: 'TypeScript', category: 'Lenguaje', icon: '📘', level: 40 },
    { name: 'Bash', category: 'Lenguaje', icon: '🔧', level: 40 },
    { name: 'PowerShell', category: 'Lenguaje', icon: '🖥️', level: 40 },
    { name: 'SQL Server', category: 'Base de datos', icon: '🗄️', level: 70 },
    { name: 'MySQL', category: 'Base de datos', icon: '🐬', level: 70 },
    { name: 'Supabase', category: 'Base de datos', icon: '⚡️', level: 50 },
    { name: 'MongoDB', category: 'Base de datos', icon: '🍃', level: 50 },
    { name: 'Redis', category: 'Base de datos', icon: '🔴', level: 50 },
    { name: 'Git', category: 'DevOps', icon: '🐈‍⬛', level: 65 },
    { name: 'Docker', category: 'DevOps', icon: '🐳', level: 40 },
    { name: 'Linux', category: 'DevOps', icon: '🐧', level: 40 },
    { name: 'Render', category: 'Cloud', icon: '🚀', level: 60 },
    { name: 'Scikit-learn', category: 'IA', icon: '📚', level: 50 },
    { name: 'Pandas', category: 'IA', icon: '🐼', level: 50 },
    { name: 'Postman', category: 'Herramientas', icon: '🧪', level: 50 },
  ];

  async getArticles(): Promise<ArticleRecord[]> {
    if (!supabase) {
      return this.fallbackArticles;
    }

    try {
      const { data, error } = await supabase.from('articles').select('*').order('date', { ascending: false });
      if (error || !data) return this.fallbackArticles;

      return (data ?? []).map((r: Record<string, unknown>) => ({
        id: String(r.id ?? r.article_id ?? ''),
        title: String(r.title ?? ''),
        slug: r.slug ? String(r.slug) : undefined,
        summary: String(r.summary ?? r.excerpt ?? ''),
        description: r.description ? String(r.description) : undefined,
        readTime: Number(r.read_time ?? r.readTime ?? 0),
        tags: Array.isArray(r.tags) ? (r.tags as string[]) : String(r.tags ?? '').split(',').map((s) => s.trim()).filter(Boolean),
        date: String(r.date ?? r.published_at ?? ''),
        url: r.url ? String(r.url) : undefined,
        image: r.image ? String(r.image) : undefined,
        featured: r.featured ? Boolean(r.featured) : undefined,
        category: r.category ? String(r.category) : undefined,
      }));
    } catch {
      return this.fallbackArticles;
    }
  }

  async getArticleById(id: string): Promise<ArticleRecord | null> {
    if (!supabase) {
      return this.fallbackArticles.find((a) => a.id === id) ?? null;
    }

    try {
      const { data, error } = await supabase.from('articles').select('*').eq('id', id).limit(1).single();
      if (error || !data) return this.fallbackArticles.find((a) => a.id === id) ?? null;

      const r = data as Record<string, unknown>;
      return {
        id: String(r.id ?? r.article_id ?? ''),
        title: String(r.title ?? ''),
        slug: r.slug ? String(r.slug) : undefined,
        summary: String(r.summary ?? r.excerpt ?? ''),
        description: r.description ? String(r.description) : undefined,
        readTime: Number(r.read_time ?? r.readTime ?? 0),
        tags: Array.isArray(r.tags) ? (r.tags as string[]) : String(r.tags ?? '').split(',').map((s) => s.trim()).filter(Boolean),
        date: String(r.date ?? r.published_at ?? ''),
        url: r.url ? String(r.url) : undefined,
        image: r.image ? String(r.image) : undefined,
        featured: r.featured ? Boolean(r.featured) : undefined,
        category: r.category ? String(r.category) : undefined,
      };
    } catch {
      return this.fallbackArticles.find((a) => a.id === id) ?? null;
    }
  }

  async getTechStack(): Promise<TechStackItem[]> {
    if (!supabase) return this.fallbackTechStack;

    try {
      const { data, error } = await supabase.from('tech_stack').select('*').order('level', { ascending: false });
      if (error || !data) return this.fallbackTechStack;

      return (data ?? []).map((r: Record<string, unknown>) => ({
        name: String(r.name ?? ''),
        category: String(r.category ?? 'Other'),
        icon: String(r.icon ?? ''),
        level: Number(r.level ?? 0),
      }));
    } catch {
      return this.fallbackTechStack;
    }
  }

  // Admin operations
  async createArticle(body: Partial<ArticleRecord>): Promise<ArticleRecord> {
    const article: ArticleRecord = {
      id: body.id ?? String(Date.now()),
      title: body.title ?? 'Untitled',
      slug: body.slug ?? undefined,
      summary: body.summary ?? '',
      description: body.description ?? undefined,
      readTime: body.readTime ?? 0,
      tags: body.tags ?? [],
      date: body.date ?? new Date().toISOString(),
      url: body.url,
      image: body.image ?? undefined,
      featured: body.featured ?? false,
      category: body.category ?? undefined,
    };

    if (supabase) {
      try {
        const payload: Record<string, unknown> = {
          id: article.id,
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          description: article.description,
          read_time: article.readTime,
          tags: article.tags,
          date: article.date,
          url: article.url,
          image: article.image,
          featured: article.featured,
          category: article.category,
          created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from('articles').insert(payload).select().single();

        if (!error && data) return this.toArticleRecord(data as Record<string, unknown>);
      } catch {
        // fall through
      }
    }

    this.fallbackArticles.unshift(article);
    return article;
  }

  async updateArticle(id: string, body: Partial<ArticleRecord>): Promise<ArticleRecord | null> {
    if (supabase) {
      try {
        const update: Record<string, unknown> = {};
        if (body.title !== undefined) update.title = body.title;
        if (body.slug !== undefined) update.slug = body.slug;
        if (body.summary !== undefined) update.summary = body.summary;
        if (body.description !== undefined) update.description = body.description;
        if (body.readTime !== undefined) update.read_time = body.readTime;
        if (body.tags !== undefined) update.tags = body.tags;
        if (body.date !== undefined) update.date = body.date;
        if (body.url !== undefined) update.url = body.url;
        if (body.image !== undefined) update.image = body.image;
        if (body.featured !== undefined) update.featured = body.featured;
        if (body.category !== undefined) update.category = body.category;

        const { data, error } = await supabase.from('articles').update(update).eq('id', id).select().single();
        if (!error && data) return this.toArticleRecord(data as Record<string, unknown>);
      } catch {
        // fall through
      }
    }

    const idx = this.fallbackArticles.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.fallbackArticles[idx] = { ...this.fallbackArticles[idx], ...body } as ArticleRecord;
    return this.fallbackArticles[idx];
  }

  async deleteArticle(id: string): Promise<ArticleRecord | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('articles').delete().eq('id', id).select().single();
        if (!error && data) return this.toArticleRecord(data as Record<string, unknown>);
      } catch {
        // fall through
      }
    }

    const idx = this.fallbackArticles.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    const [removed] = this.fallbackArticles.splice(idx, 1);
    return removed;
  }

  async createTechItem(body: Partial<TechStackItem>): Promise<TechStackItem> {
    const item: TechStackItem = {
      name: body.name ?? `tech-${Date.now()}`,
      category: body.category ?? 'Other',
      icon: body.icon ?? '',
      level: body.level ?? 0,
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('tech_stack').insert(item).select().single();
        if (!error && data) return this.toTechRecord(data as Record<string, unknown>);
      } catch {
        // fall through
      }
    }

    this.fallbackTechStack.push(item);
    return item;
  }

  async updateTechItem(name: string, body: Partial<TechStackItem>): Promise<TechStackItem | null> {
    if (supabase) {
      try {
        const update: Record<string, unknown> = {};
        if (body.category !== undefined) update.category = body.category;
        if (body.icon !== undefined) update.icon = body.icon;
        if (body.level !== undefined) update.level = body.level;

        const { data, error } = await supabase.from('tech_stack').update(update).eq('name', name).select().single();
        if (!error && data) return this.toTechRecord(data as Record<string, unknown>);
      } catch {
        // fall through
      }
    }

    const idx = this.fallbackTechStack.findIndex((t) => t.name === name);
    if (idx === -1) return null;
    this.fallbackTechStack[idx] = { ...this.fallbackTechStack[idx], ...body } as TechStackItem;
    return this.fallbackTechStack[idx];
  }

  async deleteTechItem(name: string): Promise<TechStackItem | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('tech_stack').delete().eq('name', name).select().single();
        if (!error && data) return this.toTechRecord(data as Record<string, unknown>);
      } catch {
        // fall through
      }
    }

    const idx = this.fallbackTechStack.findIndex((t) => t.name === name);
    if (idx === -1) return null;
    const [removed] = this.fallbackTechStack.splice(idx, 1);
    return removed;
  }

  private toArticleRecord(r: Record<string, unknown>): ArticleRecord {
    return {
      id: String(r.id ?? r.article_id ?? ''),
      title: String(r.title ?? ''),
      slug: r.slug ? String(r.slug) : undefined,
      summary: String(r.summary ?? r.excerpt ?? ''),
      description: r.description ? String(r.description) : undefined,
      readTime: Number(r.read_time ?? r.readTime ?? 0),
      tags: Array.isArray(r.tags) ? (r.tags as string[]) : String(r.tags ?? '').split(',').map((s) => s.trim()).filter(Boolean),
      date: String(r.date ?? r.published_at ?? ''),
      url: r.url ? String(r.url) : undefined,
      image: r.image ? String(r.image) : undefined,
      featured: r.featured ? Boolean(r.featured) : undefined,
      category: r.category ? String(r.category) : undefined,
    };
  }

  private toTechRecord(r: Record<string, unknown>): TechStackItem {
    return {
      name: String(r.name ?? ''),
      category: String(r.category ?? 'Other'),
      icon: String(r.icon ?? ''),
      level: Number(r.level ?? 0),
    };
  }
}
