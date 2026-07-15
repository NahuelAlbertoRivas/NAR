import { Injectable } from '@nestjs/common';
import { ProjectRecord } from './project.types';

@Injectable()
export class ProjectsService {
  private readonly projects: ProjectRecord[] = [
    {
      id: '1',
      title: 'Portfolio Profesional',
      slug: 'portfolio-profesional',
      shortDescription: 'Aplicación moderna para mostrar proyectos y artículos.',
      published: true,
      createdAt: new Date().toISOString(),
    },
  ];

  findAll(published?: boolean) {
    if (typeof published === 'boolean') {
      return this.projects.filter((project) => project.published === published);
    }

    return this.projects;
  }

  findOne(id: string) {
    return this.projects.find((project) => project.id === id) ?? null;
  }

  create(body: Partial<ProjectRecord>) {
    const project: ProjectRecord = {
      id: String(this.projects.length + 1),
      title: body.title ?? 'Nuevo proyecto',
      slug: body.slug ?? 'nuevo-proyecto',
      shortDescription: body.shortDescription ?? '',
      published: body.published ?? false,
      createdAt: new Date().toISOString(),
      ...body,
    };

    this.projects.push(project);
    return project;
  }

  update(id: string, body: Partial<ProjectRecord>) {
    const index = this.projects.findIndex((project) => project.id === id);
    if (index === -1) {
      return null;
    }

    this.projects[index] = {
      ...this.projects[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return this.projects[index];
  }

  remove(id: string) {
    const index = this.projects.findIndex((project) => project.id === id);
    if (index === -1) {
      return null;
    }

    const [removed] = this.projects.splice(index, 1);
    return removed;
  }
}
