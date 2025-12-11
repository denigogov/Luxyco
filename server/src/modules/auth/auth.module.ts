import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const expiresInEnv =
          config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '900';
        const expiresIn = Number.parseInt(expiresInEnv, 10);

        return {
          secret: config.get<string>('JWT_ACCESS_SECRET') ?? 'change-me',
          signOptions: {
            expiresIn: Number.isNaN(expiresIn) ? 900 : expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, RolesGuard],
  exports: [AuthService, JwtModule, RolesGuard],
})
export class AuthModule {}
