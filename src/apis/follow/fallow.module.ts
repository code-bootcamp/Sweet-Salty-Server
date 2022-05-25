import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Fallow } from './entities/follow.entity';
import { FallowResolver } from './fallow.resolver';
import { FallowService } from './fallow.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fallow, User])],
  providers: [
    //
    FallowResolver,
    FallowService,
  ],
})
export class FallowModule {}
