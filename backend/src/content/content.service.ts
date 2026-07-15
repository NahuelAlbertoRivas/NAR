import { Injectable } from '@nestjs/common';

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
      summary: 'Cómo garantizar consistencia eventual en arquitecturas de microservicios sin two-phase commit. Un análisis profundo del patrón Saga coreografiado vs orquestado y la implementación del Outbox Pattern con Debezium.',
      readTime: 12,
      tags: ['Microservicios', 'Java', 'Spring Boot', 'Arquitectura'],
      date: '2024-11-15',
    },
    {
      id: 'llm-production',
      title: 'Llevar LLMs a Producción: Lecciones Aprendidas',
      summary: 'Reflexiones prácticas sobre desafíos reales al operar modelos de lenguaje en entornos enterprise: latencia, costos, hallucinations, y cómo construir guardrails efectivos sin sacrificar utilidad.',
      readTime: 8,
      tags: ['IA', 'LLM', 'Python', 'MLOps'],
      date: '2024-09-20',
    },
    {
      id: 'kubernetes-patterns',
      title: 'Patrones Avanzados de Kubernetes para Equipos de Producto',
      summary: 'Más allá de los deployments básicos: cómo usar Init Containers, Sidecars, Pod Disruption Budgets y Custom Resources para construir plataformas resilientes que los equipos de producto puedan operar de forma autónoma.',
      readTime: 15,
      tags: ['Kubernetes', 'DevOps', 'Infraestructura', 'Cloud'],
      date: '2024-07-08',
    },
  ];

  private readonly fallbackTechStack: TechStackItem[] = [
    { name: 'Java', category: 'Lenguaje', icon: '☕', level: 95 },
    { name: 'Python', category: 'Lenguaje', icon: '🐍', level: 90 },
    { name: 'TypeScript', category: 'Lenguaje', icon: '📘', level: 80 },
    { name: 'Spring Boot', category: 'Framework', icon: '🍃', level: 95 },
    { name: 'Angular', category: 'Framework', icon: '🔺', level: 85 },
    { name: 'FastAPI', category: 'Framework', icon: '⚡', level: 85 },
    { name: 'Docker', category: 'DevOps', icon: '🐳', level: 90 },
    { name: 'Kubernetes', category: 'DevOps', icon: '☸️', level: 85 },
    { name: 'AWS', category: 'Cloud', icon: '☁️', level: 80 },
    { name: 'Azure', category: 'Cloud', icon: '🔷', level: 75 },
    { name: 'PostgreSQL', category: 'Base de datos', icon: '🐘', level: 88 },
    { name: 'MongoDB', category: 'Base de datos', icon: '🍃', level: 78 },
    { name: 'Redis', category: 'Base de datos', icon: '🔴', level: 80 },
    { name: 'Kafka', category: 'Mensajería', icon: '📨', level: 82 },
    { name: 'Git', category: 'Herramientas', icon: '🌿', level: 92 },
    { name: 'LangChain', category: 'IA', icon: '🔗', level: 78 },
  ];

  getArticles(): ArticleRecord[] {
    return this.fallbackArticles;
  }

  getArticleById(id: string): ArticleRecord | null {
    return this.fallbackArticles.find((article) => article.id === id) ?? null;
  }

  getTechStack(): TechStackItem[] {
    return this.fallbackTechStack;
  }
}
