import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardTagResolver } from './boardTag.resolver';
import { BoardTagService } from './boardTag.service';
import { BoardTag } from './entities/boardTag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardTag])],
  providers: [BoardTagResolver, BoardTagService],
})
export class BoardTagModule {}
