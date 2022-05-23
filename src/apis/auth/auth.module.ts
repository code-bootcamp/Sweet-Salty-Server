import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

import { JwtRefreshStrategy } from 'src/commons/auth/jwt-refresh.strategy';

import { User } from '../User/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from 'src/commons/auth/jwt-access.strategy';

@Module({
  imports: [
    //
    JwtModule.register({}),
    ConfigService,
    TypeOrmModule.forFeature([User]),
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
