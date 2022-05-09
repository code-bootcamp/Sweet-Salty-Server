import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../User/entities/user.entity';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  @Mutation(() => String)
  async login(
    @Args('user_email') user_email: string, //
    @Args('password') password: string,
    @Context() context: any,
  ) {
    const user = await getConnection()
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where({ user_email })
      .getOne();

    if (!user)
      throw new UnprocessableEntityException(
        '아이디 혹은 비밀번호가 다릅니다.',
      );

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth)
      throw new UnprocessableEntityException(
        '아이디 혹은 비밀번호가 다릅니다.',
      );

    this.authService.setRefreshToken({ user, res: context.res });
    return this.authService.getAccessToken({ user });
  }
  // 만료된 액세스 토큰 리프레시 토큰으로 재발급하기
  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  async restoreAccessToken(
    //
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.authService.getAccessToken({ user: currentUser });
  }

  @Mutation(() => String)
  async logout(
    //
    @Context() context: any,
  ) {
    const now = new Date();
    const access = context.req.headers.authorization.replace('Bearer ', '');
    const access_decoded = this.jwtService.decode(access);
    const access_time = new Date(access_decoded['exp'] * 1000);
    const access_end = Math.floor(
      (access_time.getTime() - now.getTime()) / 1000,
    );

    const refresh = context.req.headers.cookie.replace('refreshToken=', '');
    const refresh_decoded = this.jwtService.decode(refresh);
    const refresh_time = new Date(refresh_decoded['exp'] * 1000);
    const refresh_end = Math.floor(
      (refresh_time.getTime() - now.getTime()) / 1000,
    );

    try {
      jwt.verify(access, this.config.get('ACCESS'));
      jwt.verify(refresh, this.config.get('REFRESH'));
      await this.cacheManager.set(access, 'accessToken', { ttl: access_end });
      await this.cacheManager.set(refresh, 'refreshToken', {
        ttl: refresh_end,
      });

      return '로그아웃에 성공했습니다';
    } catch {
      throw new UnauthorizedException();
    }
  }
}
