import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';
import * as dotenv from 'dotenv';
dotenv.config();
//
//

const CLIENTID = process.env.NAVER_CLIENTID;
const CLIENTSECRET = process.env.NAVER_CLIENTSECRET;
@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: CLIENTID,
      clientSecret: CLIENTSECRET,
      callbackURL: 'http://localhost:3000/login/naver',
      //   scope: ['email', 'profile', 'name'],
    });
  }
  async validate(
    accseeToken: string, //
    refreshToken: string,
    profile: Profile,
  ) {
    return {
      user_email: profile.email,
      user_nickname: profile.name,
      user_phone: profile.mobile.replace(/-/gi, ''),
      social_site: profile.provider,
    };
  }
}

// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, Profile } from 'passport-naver';

// @Injectable()
// export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
//   constructor() {
//     super({
//       clientID: '0fK9QAKf0bxFNIIQx6py',
//       clientSecret: 'iePNRMb4ur',
//       callbackURL: 'http://localhost:3000/login/naver',
//     });
//   }
//   async validate(
//     accseeToken: string, //
//     refreshToken: string,
//     profile: Profile,
//   ) {
//     console.log(profile);
//     return {
//       user_email: profile._json.email,
//       social_site: profile.provider,
//     };
//   }
// }
