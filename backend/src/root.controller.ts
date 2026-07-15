import { Controller, Get, Head } from '@nestjs/common';

@Controller()
export class RootController {
  @Get()
  @Head()
  root() {
    const routes = [
      '/api/v1/projects',
      '/api/v1/content/articles',
      '/api/v1/content/tech',
      '/api/v1/contact',
      '/health',
    ];

    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
      links: {
        self: '/',
        health: '/health',
      },
      routes,
      build: process.env.BUILD_INFO || null,
    };
  }
}
