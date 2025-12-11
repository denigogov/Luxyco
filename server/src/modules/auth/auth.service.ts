import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

import { UsersService, UserWithRole } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { users, account_types } from '@prisma/client';
import { JwtPayload } from './types/jwt-payload.type';

type SafeUser = Omit<users, 'password'> & {
  account_types?: account_types | null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // 1) Check username + password
  private async validateUser(
    username: string,
    password: string,
  ): Promise<SafeUser> {
    const user = await this.usersService.findByUsername(username);

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // remove password from returned object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...safeUser } = user;
    return safeUser;
  }

  // 2) Create access + refresh tokens
  private async getTokens(user: SafeUser) {
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.account_types?.name ?? null,
    } as const;

    // access token uses JwtModule defaults
    const accessToken = await this.jwt.signAsync(payload);

    // refresh token: parse env to number seconds
    const refreshSecret =
      this.config.get<string>('JWT_REFRESH_SECRET') ?? 'change-me-refresh';

    const refreshExpiresEnv =
      this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '86400';

    const refreshExpires = Number.parseInt(refreshExpiresEnv, 10);
    const expiresIn: JwtSignOptions['expiresIn'] = Number.isNaN(refreshExpires)
      ? 60 * 60 * 24 * 60
      : refreshExpires;

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: refreshSecret,
      expiresIn,
    });

    return { accessToken, refreshToken };
  }

  // 3) Public login method used by controller
  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.username, dto.password);
    const tokens = await this.getTokens(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.account_types?.name ?? null,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    const refreshSecret =
      this.config.get<string>('JWT_REFRESH_SECRET') ?? 'change-me-refresh';

    let payload: JwtPayload;

    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findByUsername(payload.username);

    if (!user || !user.is_active) {
      throw new UnauthorizedException('User no longer exists or inactive');
    }

    const { password: _pw, ...safeUser } = user as UserWithRole;
    const tokens = await this.getTokens(safeUser as SafeUser);

    return {
      user: {
        id: safeUser.id,
        username: safeUser.username,
        role: safeUser.account_types?.name ?? null,
      },
      ...tokens,
    };
  }
}
