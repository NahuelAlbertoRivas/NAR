import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ContentService, ArticleRecord, TechStackItem } from './content.service';

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

  @Get('tech')
  async getTechStack(): Promise<TechStackItem[]> {
    return this.contentService.getTechStack();
  }
}
