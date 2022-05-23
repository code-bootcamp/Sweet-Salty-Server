import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-naver-v2';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENTID,
      clientSecret: process.env.NAVER_CLIENTSECRET,
      callbackURL: 'http://localhost:3000/login/naver',
      scope: ['email', 'profile', 'name'],
    });
  }
  async validate(
    accseeToken: string, //
    refreshToken: string,
    profile: Profile,
  ) {
    console.log(profile);
    return {
      userEmail: profile.email,
      userNickname: profile.name,
      userPhone: profile.mobile.replace(/-/gi, ''),
      userSignUpSite: profile.provider,
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
