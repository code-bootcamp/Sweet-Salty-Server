import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CommentLike } from './entities/commentLike.entity';

@Injectable()
export class commentLikeService {
  constructor(
    @InjectRepository(CommentLike)
    private readonly commentLikeRepository: Repository<CommentLike>,
  ) {}

  async create({ currentUser, boardId, commentId }) {
    const check = await this.commentLikeRepository
      .createQueryBuilder()
      .select('commentLike')
      .from(CommentLike, 'commentLike')
      .where({
        user: currentUser.userId, //
        comment: commentId,
        board: boardId,
      })
      .getOne();
    if (!check) {
      await this.commentLikeRepository.save({
        user: currentUser.userId, //
        comment: commentId,
        board: boardId,
      });

      await getConnection()
        .createQueryBuilder()
        .update(CommentLike)
        .set({ commentLikeCount: () => `commentLikeCount+1` })
        .where({ comment: commentId })
        .execute();
    }

    return '이미 좋아요를 누르셨습니다.';
  }
}
