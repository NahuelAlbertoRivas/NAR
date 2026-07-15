import { projects as fallbackProjects, articles as fallbackArticles, techStack as fallbackTechStack, type Project, type Article } from '../data';

interface PortfolioApiProject {
  id?: string;
  slug?: string;
  title?: string;
  shortDescription?: string;
  description?: string;
  problem?: string;
  architecture?: string;
  solution?: string;
  results?: string;
  technologies?: string[] | unknown;
  languages?: string[] | unknown;
  frameworks?: string[] | unknown;
  category?: string;
  status?: string;
  year?: number;
  featured?: boolean;
  image?: string;
  github?: string;
  demo?: string;
  videoUrl?: string;
  video_url?: string;
  screenshots?: string[] | unknown;
  timeline?: Array<{ date: string; event: string }> | unknown;
  challenges?: string[] | unknown;
  metrics?: Array<{ label: string; value: string }> | unknown;
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

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
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

  const baseProject = fallback ?? buildPlaceholderProject((record.slug ?? record.title ?? record.id ?? 'portfolio-project').toLowerCase(), record.title ?? 'Proyecto del portfolio');

  return {
    ...baseProject,
    id: record.id ?? baseProject.id,
    title: record.title ?? baseProject.title,
    shortDescription: record.shortDescription ?? baseProject.shortDescription,
    description: record.description ?? baseProject.description,
    problem: record.problem ?? baseProject.problem,
    architecture: record.architecture ?? baseProject.architecture,
    solution: record.solution ?? baseProject.solution,
    results: record.results ?? baseProject.results,
    technologies: normalizeStringArray(record.technologies ?? baseProject.technologies),
    languages: normalizeStringArray(record.languages ?? baseProject.languages),
    frameworks: normalizeStringArray(record.frameworks ?? baseProject.frameworks),
    category: record.category ?? baseProject.category,
    status: (record.status === 'in-progress' ? 'in-progress' : 'completed') as Project['status'],
    year: record.year ?? baseProject.year,
    featured: Boolean(record.featured ?? baseProject.featured),
    image: record.image ?? baseProject.image,
    github: record.github ?? baseProject.github,
    demo: record.demo ?? baseProject.demo,
    videoUrl: record.videoUrl ?? (typeof record.video_url === 'string' ? record.video_url : baseProject.videoUrl),
    screenshots: normalizeStringArray(record.screenshots ?? baseProject.screenshots),
    timeline: Array.isArray(record.timeline) ? (record.timeline as Array<{ date: string; event: string }>) : baseProject.timeline,
    challenges: normalizeStringArray(record.challenges ?? baseProject.challenges),
    metrics: Array.isArray(record.metrics) ? (record.metrics as Array<{ label: string; value: string }>) : baseProject.metrics,
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

export async function getArticleById(id: string): Promise<Article | null> {
  const data = await readJson<Article>(`/content/articles/${id}`);
  if (data) {
    return data;
  }

  return fallbackArticles.find((article) => article.id === id) ?? null;
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
