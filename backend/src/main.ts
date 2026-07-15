import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { env } from './config/env';

async function bootstrap() {
  // Do NOT perform any DB schema initialization here.
  const app = await NestFactory.create(AppModule);
  // Keep API routes under /api/v1 but allow root path '/' to be accessible
  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: '/', method: RequestMethod.GET },
      { path: '/', method: RequestMethod.HEAD },
    ],
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(env.port);
}

bootstrap();
