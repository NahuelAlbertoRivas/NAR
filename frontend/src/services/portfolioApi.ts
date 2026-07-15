import { projects as fallbackProjects, type Project } from '../data';

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
