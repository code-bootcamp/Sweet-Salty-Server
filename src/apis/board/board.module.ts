import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardSide } from '../boardSide/entities/boardSide.entity';
import { BoardTag } from '../boardTag/entities/boardTag.entity';
import { BoardResolver } from './board.resolver';
import { BoardService } from './board.service';
import { Board } from './entities/board.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, BoardTag, BoardSide]),
    ElasticsearchModule.register({
      node: 'http://147.47.209.114:9200',
    }),
  ],
  providers: [
    //
    BoardResolver,
    BoardService,
  ],
})
export class BoardModule {}
