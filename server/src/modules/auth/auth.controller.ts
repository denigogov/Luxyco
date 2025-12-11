import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(dto);

    const refreshMaxAge = 60 * 24 * 60 * 60 * 1000;

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false, // true in prod
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: refreshMaxAge,
    });

    return {
      user,
      accessToken,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.['refresh_token'];

    const {
      user,
      accessToken,
      refreshToken: newRefresh,
    } = await this.authService.refresh(refreshToken);

    const refreshMaxAge = 60 * 24 * 60 * 60 * 1000;

    // rotate refresh token
    res.cookie('refresh_token', newRefresh, {
      httpOnly: true,
      secure: false, // true in prod
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: refreshMaxAge,
    });

    return {
      user,
      accessToken,
    };
  }
}
