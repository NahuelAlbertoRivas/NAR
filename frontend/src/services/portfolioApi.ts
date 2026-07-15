import { projects as fallbackProjects, articles as fallbackArticles, techStack as fallbackTechStack, type Project, type Article } from '../data';

interface PortfolioApiProject {
  id?: string;
  slug?: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

function buildPlaceholderProject(id: string, title: string): Project {
  return {
    id,
    title,
    shortDescription: '',
    description: 'Descripción pendiente.',
    problem: '',
    architecture: '',
    solution: '',
    results: '',
    technologies: [],
    languages: [],
    frameworks: [],
    category: 'General',
    status: 'completed',
    year: new Date().getFullYear(),
    featured: false,
    image: '',
    screenshots: [],
    timeline: [],
    challenges: [],
    metrics: [],
  };
}

function mapProject(record: PortfolioApiProject): Project {
  const normalizedTitle = record.title?.toLowerCase() ?? '';
  const fallback = fallbackProjects.find((project) => {
    const projectTitle = project.title.toLowerCase();
    const projectId = project.id.toLowerCase();
    const recordId = (record.id ?? '').toLowerCase();
    const recordSlug = (record.slug ?? '').toLowerCase();

    return (
      projectId === recordId ||
      recordSlug === projectId ||
      projectTitle === normalizedTitle ||
      projectTitle.includes(normalizedTitle) ||
      normalizedTitle.includes(projectTitle)
    );
  });

  if (fallback) {
    return {
      ...fallback,
      id: record.id ?? fallback.id,
      title: record.title ?? fallback.title,
      shortDescription: record.shortDescription ?? fallback.shortDescription,
      description: record.description ?? fallback.description,
    };
  }

  const fallbackId = (record.slug ?? record.title ?? record.id ?? 'portfolio-project').toLowerCase();
  return {
    ...buildPlaceholderProject(fallbackId, record.title ?? 'Proyecto del portfolio'),
    shortDescription: record.shortDescription ?? 'Proyecto del portfolio',
    description: record.description ?? 'Descripción pendiente.',
  };
}

async function readJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  const data = await readJson<PortfolioApiProject[]>('/projects');
  if (Array.isArray(data) && data.length > 0) {
    return data.map(mapProject);
  }

  return fallbackProjects;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const data = await readJson<PortfolioApiProject>(`/projects/${id}`);
  if (data) {
    return mapProject({ ...data, id });
  }

  return fallbackProjects.find((project) => project.id === id) ?? null;
}

export async function getArticles(): Promise<Article[]> {
  const data = await readJson<Article[]>('/content/articles');
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }

  return fallbackArticles;
}

export async function getTechStack(): Promise<Array<{ name: string; category: string; icon: string; level: number }>> {
  const data = await readJson<Array<{ name: string; category: string; icon: string; level: number }>>('/content/tech');
  if (Array.isArray(data) && data.length > 0) {
    return data;
  }

  return fallbackTechStack;
}

export async function submitContactMessage(payload: { name: string; email: string; subject: string; message: string }) {
  const data = await postJson<{ id: string; submittedAt: string }>( '/contact', payload);
  if (data) {
    return { ok: true, data };
  }

  return { ok: false, data: null };
}
