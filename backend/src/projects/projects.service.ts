import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { supabase } from '../database/supabase.client';
import { ProjectRecord } from './project.types';

@Injectable()
export class ProjectsService {
  constructor() {
    console.log('ProjectsService instantiated');
  }
  private readonly fallbackProjects: ProjectRecord[] = [
    {
      id: '1',
      title: 'Portfolio Profesional',
      slug: 'portfolio-profesional',
      shortDescription: 'Aplicación moderna para mostrar proyectos y artículos.',
      published: true,
      createdAt: new Date().toISOString(),
    },
  ];

  async findAll(published?: boolean): Promise<ProjectRecord[]> {
    const fromSupabase = await this.fetchFromSupabase();
    if (fromSupabase && fromSupabase.length > 0) {
      const projects = fromSupabase.filter((project) =>
        typeof published === 'boolean' ? project.published === published : true,
      );
      return projects;
    }

    return typeof published === 'boolean'
      ? this.fallbackProjects.filter((project) => project.published === published)
      : this.fallbackProjects;
  }

  async findOne(id: string): Promise<ProjectRecord | null> {
    const fromSupabase = await this.fetchFromSupabase();
    if (fromSupabase && fromSupabase.length > 0) {
      return fromSupabase.find((project) => project.id === id) ?? null;
    }

    return this.fallbackProjects.find((project) => project.id === id) ?? null;
  }

  async create(body: Partial<ProjectRecord>): Promise<ProjectRecord> {
    const project: ProjectRecord = {
      id: randomUUID(),
      title: body.title ?? 'Nuevo proyecto',
      slug: body.slug ?? 'nuevo-proyecto',
      shortDescription: body.shortDescription ?? '',
      published: body.published ?? false,
      createdAt: new Date().toISOString(),
      ...body,
    };

    if (supabase) {
      try {
        const payload: Record<string, unknown> = {
          id: project.id,
          title: project.title,
          slug: project.slug,
          short_description: project.shortDescription,
          description: project.description,
          problem: project.problem,
          architecture: project.architecture,
          solution: project.solution,
          results: project.results,
          technologies: project.technologies,
          languages: project.languages,
          frameworks: project.frameworks,
          category: project.category,
          status: project.status,
          year: project.year,
          featured: project.featured,
          image: project.image,
          github: project.github,
          demo: project.demo,
          screenshots: project.screenshots,
          timeline: project.timeline,
          challenges: project.challenges,
          metrics: project.metrics,
          read_time: project.readTime,
          date: project.date,
          url: project.url,
          published: project.published,
          created_at: project.createdAt,
        };

        const { data, error } = await supabase.from('projects').insert(payload).select().single();

        if (error) {
          console.error('ProjectsService create error:', error);
          throw error;
        }

        if (data) {
          return this.toProjectRecord(data);
        }
      } catch (error) {
        console.error('ProjectsService create failed:', error);
        // Fall back to the in-memory store if Supabase is unavailable.
      }
    }

    this.fallbackProjects.push(project);
    return project;
  }

  async update(id: string, body: Partial<ProjectRecord>): Promise<ProjectRecord | null> {
    if (supabase) {
      try {
        const updatePayload: Record<string, unknown> = {};
        if (body.title !== undefined) updatePayload.title = body.title;
        if (body.slug !== undefined) updatePayload.slug = body.slug;
        if (body.shortDescription !== undefined) updatePayload.short_description = body.shortDescription;
        if (body.published !== undefined) updatePayload.published = body.published;
        if (body.description !== undefined) updatePayload.description = body.description;
        if (body.problem !== undefined) updatePayload.problem = body.problem;
        if (body.architecture !== undefined) updatePayload.architecture = body.architecture;
        if (body.solution !== undefined) updatePayload.solution = body.solution;
        if (body.results !== undefined) updatePayload.results = body.results;
        if (body.technologies !== undefined) updatePayload.technologies = body.technologies;
        if (body.languages !== undefined) updatePayload.languages = body.languages;
        if (body.frameworks !== undefined) updatePayload.frameworks = body.frameworks;
        if (body.category !== undefined) updatePayload.category = body.category;
        if (body.status !== undefined) updatePayload.status = body.status;
        if (body.year !== undefined) updatePayload.year = body.year;
        if (body.featured !== undefined) updatePayload.featured = body.featured;
        if (body.image !== undefined) updatePayload.image = body.image;
        if (body.github !== undefined) updatePayload.github = body.github;
        if (body.demo !== undefined) updatePayload.demo = body.demo;
        if (body.screenshots !== undefined) updatePayload.screenshots = body.screenshots;
        if (body.timeline !== undefined) updatePayload.timeline = body.timeline;
        if (body.challenges !== undefined) updatePayload.challenges = body.challenges;
        if (body.metrics !== undefined) updatePayload.metrics = body.metrics;
        if (body.readTime !== undefined) updatePayload.read_time = body.readTime;
        if (body.date !== undefined) updatePayload.date = body.date;
        if (body.url !== undefined) updatePayload.url = body.url;

        const { data, error } = await supabase.from('projects').update(updatePayload).eq('id', id).select().single();
        if (error) {
          console.error('ProjectsService update error:', error);
          throw error;
        }
        if (data) {
          return this.toProjectRecord(data as Record<string, unknown>);
        }
      } catch (error) {
        console.error('ProjectsService update failed:', error);
        // fall through to fallback store
      }
    }

    const index = this.fallbackProjects.findIndex((project) => project.id === id);
    if (index === -1) return null;

    this.fallbackProjects[index] = {
      ...this.fallbackProjects[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return this.fallbackProjects[index];
  }

  async remove(id: string): Promise<ProjectRecord | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('projects').delete().eq('id', id).select().single();
        if (!error && data) {
          return this.toProjectRecord(data as Record<string, unknown>);
        }
      } catch {
        // fall through to fallback
      }
    }

    const index = this.fallbackProjects.findIndex((project) => project.id === id);
    if (index === -1) return null;
    const [removed] = this.fallbackProjects.splice(index, 1);
    return removed;
  }

  private async fetchFromSupabase(): Promise<ProjectRecord[] | null> {
    if (!supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) {
        return null;
      }

      return (data ?? []).map((record) => this.toProjectRecord(record));
    } catch {
      return null;
    }
  }

  private toProjectRecord(record: Record<string, unknown>): ProjectRecord {
    return {
      id: String(record.id ?? record.project_id ?? '0'),
      title: String(record.title ?? ''),
      slug: record.slug ? String(record.slug) : undefined,
      shortDescription: String(record.short_description ?? record.shortDescription ?? ''),
      description: record.description ? String(record.description) : undefined,
      problem: record.problem ? String(record.problem) : undefined,
      architecture: record.architecture ? String(record.architecture) : undefined,
      solution: record.solution ? String(record.solution) : undefined,
      results: record.results ? String(record.results) : undefined,
      technologies: Array.isArray(record.technologies) ? (record.technologies as string[]) : undefined,
      languages: Array.isArray(record.languages) ? (record.languages as string[]) : undefined,
      frameworks: Array.isArray(record.frameworks) ? (record.frameworks as string[]) : undefined,
      category: record.category ? String(record.category) : undefined,
      status: record.status ? String(record.status) : undefined,
      year: record.year ? Number(record.year) : undefined,
      featured: record.featured ? Boolean(record.featured) : undefined,
      image: record.image ? String(record.image) : undefined,
      github: record.github ? String(record.github) : undefined,
      demo: record.demo ? String(record.demo) : undefined,
      screenshots: Array.isArray(record.screenshots) ? (record.screenshots as string[]) : undefined,
      timeline: record.timeline ?? undefined,
      challenges: Array.isArray(record.challenges) ? (record.challenges as string[]) : undefined,
      metrics: record.metrics ?? undefined,
      tags: Array.isArray(record.tags) ? (record.tags as string[]) : undefined,
      readTime: record.read_time ? Number(record.read_time) : undefined,
      date: record.date ? String(record.date) : undefined,
      url: record.url ? String(record.url) : undefined,
      published: Boolean(record.published),
      createdAt: String(record.created_at ?? record.createdAt ?? new Date().toISOString()),
      updatedAt: record.updated_at ? String(record.updated_at) : undefined,
    };
  }
}
