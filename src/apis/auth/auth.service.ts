import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import path from 'path';

@Injectable()
export class AuthService {
  constructor(
    //

    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async getAccessToken({ user }) {
    return this.jwtService.sign(
      { user_email: user.user_email },
      {
        secret: this.config.get('ACCESS'),
        expiresIn: '30m',
      },
    );
  }
  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { user_email: user.user_email },
      { secret: this.config.get('REFRESH'), expiresIn: '2w' },
    );
    // 개발 환경
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
  }

  social_login({ user, res }) {
    this.setRefreshToken({ user, res });
    res.redirect(
      'http://localhost:5500/main-project/frontend/login/index.html',
    );
  }
}

// 배포 환경
// res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com') // 허용해주는 사이트
// res.setHeader(
//   'Set-Cookie',
//   `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com;
// SameSite=None; Secure; httpOnly;`
// )
