import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { getConnection, Repository } from 'typeorm';
import { BoardSide } from '../boardSide/entities/boardSide.entity';
import { BoardTag } from '../boardTag/entities/boardTag.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardTag)
    private readonly boardTagRepository: Repository<BoardTag>,
  ) {}

  async findAll() {
    return await this.boardRepository.find();
  }

  async findOne({ boardId }) {
    return await this.boardRepository.findOne({ boardId });
  }

  async findGender({ gender, page }) {
    return await this.boardRepository.find({
      where: { gender },
      skip: (page - 1) * 10,
      take: 10,
      order: { createAt: 'DESC' },
    });
  }

  async findAgeGroup({ ageGroup, page }) {
    return await this.boardRepository.find({
      where: {
        ageGroup,
      },
      skip: (page - 1) * 10,
      take: 10,
      order: { createAt: 'DESC' },
    });
  }

  async findGenderWithAgeGroup({ gender, ageGroup, page }) {
    return await this.boardRepository.find({
      where: {
        gender,
        ageGroup,
      },
      skip: (page - 1) * 10,
      take: 10,
      order: { createAt: 'DESC' },
    });
  }

  async findTest({ boardTagsInput }) {
    const { boardTagMenu, boardTagRegion, boardTagTogether } = boardTagsInput;

    const q = await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.boardSides', 'boardSide')
      .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
      .where('boardTag.boardTagName = :boardTagName1', {
        boardTagName1: '닭고기',
      })
      .orWhere('boardTag.boardTagName = :boardTagName2', {
        boardTagName2: '피자',
      })
      .getMany();

    console.log(q);

    return;
  }

  async create({ createBoardInput, boardTagsInput }) {
    const { boardTagMenu, boardTagRegion, boardTagMood } = boardTagsInput;

    const board = await this.boardRepository.save({
      ...createBoardInput,
    });

    await Promise.all([
      boardTagMenu.reduce(async (acc, cur) => {
        const menu = cur.substring(1);
        const menuData = await this.boardTagRepository.findOne({
          boardTagName: menu,
        });
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(BoardSide)
          .values({
            boards: board.boardId,
            boardTags: menuData,
            tagName: menuData.boardTagName,
          })
          .execute();
      }, ''),

      boardTagRegion.reduce(async (acc, cur) => {
        const region = cur.substring(1);
        const regionData = await this.boardTagRepository.findOne({
          boardTagName: region,
        });
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(BoardSide)
          .values({
            boards: board.boardId,
            boardTags: regionData,
            tagName: regionData.boardTagName,
          })
          .execute();
      }, ''),
      boardTagMood.reduce(async (acc, cur) => {
        const mood = cur.substring(1);
        const moodData = await this.boardTagRepository.findOne({
          boardTagName: mood,
        });
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(BoardSide)
          .values({
            boards: board.boardId,
            boardTags: moodData,
            tagName: moodData.boardTagName,
          })
          .execute();
      }, ''),
    ]);

    const tag = await getConnection()
      .createQueryBuilder()
      .select('boardSide')
      .from(BoardSide, 'boardSide')
      .innerJoinAndSelect('boardSide.boardTags', 'boardTag')
      .where({ boards: board.boardId })
      .getMany();

    return await this.boardRepository.save({
      ...board,
      boardSides: tag,
    });
  }

  async loginCreate({ currentUser, createBoardInput, boardTagsInput }) {
    const { boardTagMenu, boardTagRegion, boardTagTogether } = boardTagsInput;

    const boardTags = [];
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
