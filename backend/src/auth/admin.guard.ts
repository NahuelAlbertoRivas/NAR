import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { env } from '../config/env';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const headerKey = request.headers['x-admin-key'] || request.headers['x-admin-token'];
    const queryKey = request.query?.admin_key;
    const provided = String(headerKey ?? queryKey ?? '');
    const expected = env.adminApiKey || 'portfolio-admin-key';

    if (!provided || provided !== expected) {
      throw new UnauthorizedException('Invalid admin key');
    }

    return true;
  }
}
