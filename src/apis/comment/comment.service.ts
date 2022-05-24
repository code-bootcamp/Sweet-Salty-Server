import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Comment } from '../comment/entities/comment.entity';
import { Board } from '../board/entities/board.entity';

@Injectable()
export class commentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll({ boardId }) {
    return await this.commentRepository.find({
      where: {
        board: boardId,
      },
      relations: ['board'],
    });
  }

  async test({ boardId }) {

    const qqq = await 
  }

  async create({ currentUser, boardId, contents }) {
    const userData = await getConnection()
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where({ userId: currentUser.userId })
      .getOne();

    return await this.commentRepository.save({
      user: currentUser.userId,
      board: boardId,
      writer: userData,
      commentContents: contents,
    });
  }

  async update({ currentUser, boardId, contents }): Promise<Comment> {
    const target = await getConnection()
      .createQueryBuilder()
      .select('comment')
      .from(Comment, 'comment')
      .where({ user: currentUser.userId, board: boardId })
      .getOne();

    return await this.commentRepository.save({
      ...target,
      commentContents: contents,
    });
  }

  async delete({ commentId }) {
    const result = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Comment, 'comment')
      .where({ commentId })
      .execute();

    if (result.affected) {
      return '삭제되었습니다';
    }

    return '유효하지 않은 commentid입니다.';
  }
}
