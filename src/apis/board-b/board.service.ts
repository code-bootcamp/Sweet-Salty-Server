import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async findAll() {
    return await this.boardRepository.find();
  }

  async findOne({ boardId }) {
    return await this.boardRepository.findOne({ boardId });
  }

  async create({ createBoardInput }) {
    const result = await this.boardRepository.save({
      ...createBoardInput,
    });
    return result;
  }

  async update({ boardId, updateBoardInput }) {
    const board = await this.boardRepository.findOne({
      where: { boardId },
    });

    const newBoard = {
      ...board,
      ...updateBoardInput,
    };

    return await this.boardRepository.save(newBoard);
  }

  async delete({ boardId }) {
    const result = await this.boardRepository.softDelete({
      boardId,
    });
    return result.affected ? true : false;
  }
}
