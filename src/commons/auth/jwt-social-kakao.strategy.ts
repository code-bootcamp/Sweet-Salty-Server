import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';
import * as dotenv from 'dotenv';
dotenv.config();
//
//
const CLIENTID = process.env.KAKAO_CLIENTID;
const CLIENTSECRET = process.env.KAKAO_CLIENTSECRET;
@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: CLIENTID,
      clientSecret: CLIENTSECRET,
      callbackURL: 'http://localhost:3000/login/kakao',
    });
  }

  async validate(
    accseeToken: string, //
    refreshToken: string,
    profile: Profile,
  ) {
    console.log(profile);
    return {
      user_email: profile._json.kakao_account.email,
      user_nickname: profile.username,
      social_site: profile.provider,
    };
  }
}
