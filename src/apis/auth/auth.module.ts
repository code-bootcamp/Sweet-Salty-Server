import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';

import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    //
    JwtModule.register({}),
    ConfigService,
    TypeOrmModule.forFeature([User]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [],
  providers: [
    //

    JwtRefreshStrategy,
    JwtAccessStrategy,
    AuthResolver,
    AuthService,
  ],
})
export class AuthModule {}
