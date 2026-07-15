import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ProjectsModule } from './projects/projects.module';
import { ContentModule } from './content/content.module';
import { ContactModule } from './contact/contact.module';
import { RootController } from './root.controller';

@Module({
  imports: [HealthModule, ProjectsModule, ContentModule, ContactModule],
  controllers: [RootController],
  providers: [],
})
export class AppModule {}
