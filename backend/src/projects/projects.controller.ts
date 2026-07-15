import { Controller, Get, Post, Body, Param, Patch, Delete, Query, BadRequestException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectRecord } from './project.types';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async findAll(@Query('published') published?: string): Promise<ProjectRecord[]> {
    return this.projectsService.findAll(published === 'true');
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProjectRecord | null> {
    return this.projectsService.findOne(id);
  }

  @Post()
  async create(@Body() body: CreateProjectDto): Promise<ProjectRecord> {
    this.validateCreatePayload(body);
    return this.projectsService.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateProjectDto): Promise<ProjectRecord | null> {
    this.validateUpdatePayload(body);
    return this.projectsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ProjectRecord | null> {
    return this.projectsService.remove(id);
  }

  private validateCreatePayload(body: CreateProjectDto) {
    if (!body.title || !body.slug || !body.shortDescription) {
      throw new BadRequestException('title, slug and shortDescription are required');
    }
  }

  private validateUpdatePayload(body: UpdateProjectDto) {
    if (body.title !== undefined && !body.title.trim()) {
      throw new BadRequestException('title cannot be empty');
    }

    if (body.slug !== undefined && !body.slug.trim()) {
      throw new BadRequestException('slug cannot be empty');
    }

    if (body.shortDescription !== undefined && !body.shortDescription.trim()) {
      throw new BadRequestException('shortDescription cannot be empty');
    }
  }
}
