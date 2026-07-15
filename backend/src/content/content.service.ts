import { Injectable } from '@nestjs/common';
import { supabase } from '../database/supabase.client';

export interface ArticleRecord {
  id: string;
  title: string;
  summary: string;
  readTime: number;
  tags: string[];
  date: string;
  url?: string;
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
    { name: 'Java', category: 'Lenguaje', icon: '☕', level: 95 },
    { name: 'Python', category: 'Lenguaje', icon: '🐍', level: 90 },
    { name: 'TypeScript', category: 'Lenguaje', icon: '📘', level: 80 },
    { name: 'PostgreSQL', category: 'Base de datos', icon: '🐘', level: 88 },
    { name: 'Redis', category: 'Base de datos', icon: '🔴', level: 80 },
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
        summary: String(r.summary ?? r.excerpt ?? ''),
        readTime: Number(r.read_time ?? r.readTime ?? 0),
        tags: Array.isArray(r.tags) ? (r.tags as string[]) : String(r.tags ?? '').split(',').map((s) => s.trim()).filter(Boolean),
        date: String(r.date ?? r.published_at ?? ''),
        url: r.url ? String(r.url) : undefined,
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
        summary: String(r.summary ?? r.excerpt ?? ''),
        readTime: Number(r.read_time ?? r.readTime ?? 0),
        tags: Array.isArray(r.tags) ? (r.tags as string[]) : String(r.tags ?? '').split(',').map((s) => s.trim()).filter(Boolean),
        date: String(r.date ?? r.published_at ?? ''),
        url: r.url ? String(r.url) : undefined,
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
}
