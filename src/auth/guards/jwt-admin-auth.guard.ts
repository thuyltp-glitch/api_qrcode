import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAdminAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string = request.headers['authorization'] || '';

    if (!authHeader.toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header (Must be Bearer token)');
    }

    const token = authHeader.substring(7);
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload.role !== 'admin') {
        throw new UnauthorizedException('Admin access required');
      }
      request.user = { adminId: payload.sub, username: payload.username, role: payload.role };
      return true;
    } catch (error: any) {
      console.error('JWT Verification Error:', error.message);
      throw new UnauthorizedException(`Token verification failed. Details: ${error.message}`);
    }
  }
}
