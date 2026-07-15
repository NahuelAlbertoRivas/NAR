import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectRecord } from './project.types';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@Query('published') published?: string): ProjectRecord[] {
    return this.projectsService.findAll(published === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string): ProjectRecord | null {
    return this.projectsService.findOne(id);
  }

  @Post()
  create(@Body() body: Partial<ProjectRecord>): ProjectRecord {
    return this.projectsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<ProjectRecord>): ProjectRecord | null {
    return this.projectsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): ProjectRecord | null {
    return this.projectsService.remove(id);
  }
}
