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
        const { data, error } = await supabase
          .from('projects')
          .insert({
            id: project.id,
            title: project.title,
            slug: project.slug,
            short_description: project.shortDescription,
            published: project.published,
            created_at: project.createdAt,
          })
          .select()
          .single();

        if (!error && data) {
          return this.toProjectRecord(data);
        }
      } catch {
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

        const { data, error } = await supabase.from('projects').update(updatePayload).eq('id', id).select().single();
        if (!error && data) {
          return this.toProjectRecord(data as Record<string, unknown>);
        }
      } catch {
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
      slug: String(record.slug ?? ''),
      shortDescription: String(record.short_description ?? record.shortDescription ?? ''),
      published: Boolean(record.published),
      createdAt: String(record.created_at ?? record.createdAt ?? new Date().toISOString()),
      updatedAt: record.updated_at ? String(record.updated_at) : undefined,
    };
  }
}
