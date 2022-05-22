import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
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
      userEmail: profile._json.kakao_account.email,
      userNickname: profile.username,
      userSignUpSite: profile.provider,
    };
  }
}
