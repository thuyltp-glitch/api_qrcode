import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-for-admin',
    });
  }

  async validate(payload: any) {
    if (payload.role !== 'admin') {
      throw new UnauthorizedException('You do not have admin access');
    }
    return { adminId: payload.sub, username: payload.username, role: payload.role };
  }
}
