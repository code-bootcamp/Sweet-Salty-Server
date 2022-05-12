import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Board } from '../board/entities/board.entity';
import { BoardLike } from './entities/boardLike.entity';

@Injectable()
export class BoardLikeService {
  constructor(
    @InjectRepository(BoardLike)
    private readonly boardLikeRepository: Repository<BoardLike>,
  ) {}

  async create({ currentUser, boardId }) {
    const check = await this.boardLikeRepository
      .createQueryBuilder()
      .select('boardLike')
      .from(BoardLike, 'boardLike')
      .where({
        user: currentUser.userId, //
        board: boardId,
      })
      .getOne();

    if (check) throw new ConflictException('이미 좋아요를 누르셨습니다.');

    await this.boardLikeRepository.save({
      user: currentUser.userId, //
      board: boardId,
    });

    await getConnection()
      .createQueryBuilder()
      .update(Board)
      .set({ boardLikeCount: () => `boardLikeCount+1` })
      .where({ boardId })
      .execute();

    return `좋아요`;
  }
}
