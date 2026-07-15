import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ProjectsModule } from './projects/projects.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [HealthModule, ProjectsModule, ContentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
