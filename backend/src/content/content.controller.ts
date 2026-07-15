import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ContentService, ArticleRecord, TechStackItem } from './content.service';

@Controller('content')
export class ContentController {
  constructor(@Inject(ContentService) private readonly contentService: ContentService) {}

  @Get('articles')
  getArticles(): ArticleRecord[] {
    return this.contentService.getArticles();
  }

  @Get('articles/:id')
  getArticleById(@Param('id') id: string): ArticleRecord | null {
    return this.contentService.getArticleById(id);
  }

  @Get('tech')
  getTechStack(): TechStackItem[] {
    return this.contentService.getTechStack();
  }
}
