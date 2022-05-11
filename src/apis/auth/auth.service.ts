import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    //

    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly httpService: HttpService,
  ) {}

  async getAccessToken({ user }) {
    const Access = this.jwtService.sign(
      { userEmail: user.userEmail },
      {
        secret: this.config.get('ACCESS'),
        expiresIn: '30m',
      },
    );
    console.log(Access);

    const obj = {};
    obj['accessToken'] = Access;

    return obj;
  }
  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { userEmail: user.userEmail },
      { secret: this.config.get('REFRESH'), expiresIn: '2w' },
    );
    console.log(refreshToken);

    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=project08.site; Secure; httpOnly; SameSite=None;`,
    );
  }

  social_login({ user, res }) {
    this.setRefreshToken({ user, res });
    res.redirect(
      'http://localhost:5500/main-project/frontend/login/index.html',
    );
  }

  async sendTokenToPhone({ phone }) {
    const token = String(Math.floor(Math.random() * 10 ** 6)).padStart(6, '0');
    const tokenData = await this.cacheManager.get(phone);

    await this.cacheManager.set(phone, token, { ttl: 300 });

    await this.httpService
      .post(
        `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${process.env.SMS_APP_KEY}/sender/sms`,
        {
          body: `안녕하세요 인증번호는 [${token}]입니다.`,
          sendNo: process.env.SMS_SENDER,
          recipientList: [
            {
              internationalRecipientNo: phone,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'X-Secret-Key': process.env.SMS_X_SECRET_KEY,
          },
        },
      )
      .toPromise();
    if (tokenData === null) {
      return `인증번호가 발송되었습니다.`;
    } else {
      return `인증번호가 변경되었습니다.`;
    }
  }

  async checkToken({ phone, token }) {
    const tokenData = await this.cacheManager.get(phone);
    if (tokenData === token) {
      return true;
    } else {
      return false;
    }
  }
}

// 배포 환경
// res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com') // 허용해주는 사이트
// res.setHeader(
//   'Set-Cookie',
//   `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com;
// SameSite=None; Secure; httpOnly;`
// )
