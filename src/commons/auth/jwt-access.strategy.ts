import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { User } from 'src/apis/User/entities/user.entity';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      //
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const access = req.headers.authorization.replace('Bearer ', '');
    console.log(access);

    const check = await this.cacheManager.get(access);

    if (check) throw new UnauthorizedException();

    const user = await this.userRepository
      .createQueryBuilder()
      .where({ user_email: payload.user_email })
      .getOne();

    return {
      user_email: payload.user_email,
      user_id: user.user_id,
    };
  }
}

// 쿼리가 실행이 되기 전에 검증
// guard 라는 나만의 전략을 검증이 되야만 쿼리문이 실행된다
// 토큰방식으로 인증을 하게 된다
// 컨스트럭터가 1번, 검증부
// 검증이 완료가 되면 2번, validate가 실행된다
// payload는 복호화된 정보를 받아온다
// const redisAccessToken = await this.cacheManager.get('accessToken');
// const headersInAccessToken = req.headers.authorization.split(' ')[1];
// if (!(await this.cacheManager.get(headersInAccessToken)))
//   throw new UnauthorizedException();
// if (redisAccessToken === headersInAccessToken)
//   throw new UnauthorizedException();

// console.log(headersInAccessToken);
// console.log(redisAccessToken);
