import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ProjectsModule } from './projects/projects.module';
import { ContentModule } from './content/content.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [HealthModule, ProjectsModule, ContentModule, ContactModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
