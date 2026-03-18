import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdminAuthGuard } from './guards/jwt-admin-auth.guard';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-for-admin',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [JwtAdminAuthGuard],
  exports: [JwtAdminAuthGuard, JwtModule],
})
export class SharedAuthModule {}
