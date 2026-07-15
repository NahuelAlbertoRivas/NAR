import { Controller, Get, Inject, Param, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { ContentService, ArticleRecord, TechStackItem } from './content.service';
import { AdminGuard } from '../auth/admin.guard';

@Controller('content')
export class ContentController {
  constructor(@Inject(ContentService) private readonly contentService: ContentService) {}

  @Get('articles')
  async getArticles(): Promise<ArticleRecord[]> {
    return this.contentService.getArticles();
  }

  @Get('articles/:id')
  async getArticleById(@Param('id') id: string): Promise<ArticleRecord | null> {
    return this.contentService.getArticleById(id);
  }

  @Post('articles')
  @UseGuards(AdminGuard)
  async createArticle(@Body() body: Partial<ArticleRecord>): Promise<ArticleRecord> {
    return this.contentService.createArticle(body);
  }

  @Patch('articles/:id')
  @UseGuards(AdminGuard)
  async updateArticle(@Param('id') id: string, @Body() body: Partial<ArticleRecord>): Promise<ArticleRecord | null> {
    return this.contentService.updateArticle(id, body);
  }

  @Delete('articles/:id')
  @UseGuards(AdminGuard)
  async deleteArticle(@Param('id') id: string): Promise<ArticleRecord | null> {
    return this.contentService.deleteArticle(id);
  }

  @Get('tech')
  async getTechStack(): Promise<TechStackItem[]> {
    return this.contentService.getTechStack();
  }

  @Post('tech')
  @UseGuards(AdminGuard)
  async createTechItem(@Body() body: Partial<TechStackItem>): Promise<TechStackItem> {
    return this.contentService.createTechItem(body);
  }

  @Patch('tech/:name')
  @UseGuards(AdminGuard)
  async updateTechItem(@Param('name') name: string, @Body() body: Partial<TechStackItem>): Promise<TechStackItem | null> {
    return this.contentService.updateTechItem(name, body);
  }

  @Delete('tech/:name')
  @UseGuards(AdminGuard)
  async deleteTechItem(@Param('name') name: string): Promise<TechStackItem | null> {
    return this.contentService.deleteTechItem(name);
  }
}
