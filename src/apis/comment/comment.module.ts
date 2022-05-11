import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../board/entities/board.entity';
import { commentResolver } from './comment.resolver';
import { commentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [commentResolver, commentService],
})
export class CommentModule {}
