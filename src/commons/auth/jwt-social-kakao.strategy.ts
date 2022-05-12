import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: 'b1bd10c832ab66f90ff918ac10306969',
      clientSecret: '1OT08WRuVJm6T8nGqraLU9GxxkKlhH4y',
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
