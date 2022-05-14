import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';

import {
  createQueryBuilder,
  getConnection,
  getRepository,
  Repository,
} from 'typeorm';
import { BoardSide } from '../boardSide/entities/boardSide.entity';
import { BoardTag } from '../boardTag/entities/boardTag.entity';
import { User } from '../user/entities/user.entity';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardTag)
    private readonly boardTagRepository: Repository<BoardTag>,
    @InjectRepository(BoardSide)
    private readonly boardSideRepository: Repository<BoardSide>,
  ) {}

  async findAll() {
    return await this.boardRepository.find();
  }

  async findOne({ boardId }) {
    return await this.boardRepository.findOne({ boardId });
  }

  async findTest({ boardTagsInput }) {
    console.log(boardTagsInput);

    const check = await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.boardTags', 'boardTag')
      .where({ boardTags: '362' })
      .getMany();

    // const data = await this.boardRepository.findOne({
    //   where: { boardTags: 'bc794061-5d3f-4e57-aa53-65664862844c' },
    //   relations: ['boardTags'],
    // });

    console.log(check);

    const arr = [];

    // for (const array of check) {
    //   //  const overlap = array.boardTags.some((el) => el.boardTagMenu === '치킨');
    //   //const data = array.boardTags.filter((el) => !null);
    //   const daaa = array.boardTags.map((el) => console.log(el));
    // }

    return; //arr;
  }

  async create({ createBoardInput, createBoardTagsInput }) {
    const { boardTagMenu, boardTagRegion, boardTagTogether } =
      createBoardTagsInput;

    const board = await this.boardRepository.save({
      ...createBoardInput,
    });
    //   boardTagMenu.map((el) => console.log(el));

    boardTagMenu.reduce(async (acc, cur: string) => {
      const menu = cur.substring(1);
      const menuId = await this.boardTagRepository.findOne({
        boardTagMenu: menu,
      });
      await this.boardSideRepository.save({
        boards: board.boardId,
        boardTags: { boardTagId: menuId.boardTagId },
      });
    }, '');

    boardTagRegion.reduce(async (acc, cur: string) => {
      const region = cur.substring(1);
      const regionId = await this.boardTagRepository.findOne({
        boardTagRegion: region,
      });
      await this.boardSideRepository.save({
        boards: board.boardId,
        boardTags: { boardTagId: regionId.boardTagId },
      });
    }, '');

    boardTagTogether.reduce(async (acc, cur: string) => {
      const together = cur.substring(1);
      const togetherId = await this.boardTagRepository.findOne({
        boardTagTogether: together,
      });
      await this.boardSideRepository.save({
        boards: board.boardId,
        boardTags: { boardTagId: togetherId.boardTagId },
      });
    }, '');

    // const qqqq = await getConnection()
    //   .createQueryBuilder()
    //   .select('boardSide')
    //   .from(BoardSide, 'boardSide')
    //   .innerJoinAndSelect('boardSide.boards', 'boards')
    //   .innerJoinAndSelect('boardSide.boardTags', 'boardTags')
    //   .where({ boards: board.boardId })
    //   .getMany();

    const ee = await getConnection()
      .createQueryBuilder()
      .select('boardSide')
      .from(BoardSide, 'boardSide')
      .where({ boards: '40' })
      .leftJoinAndSelect('boardSide.boardTags', 'boardTags')
      .getMany();
    console.log(ee);

    const aaa = await this.boardRepository.save({
      ...createBoardInput,
      boardSides: ee,
    });

    return aaa;

    // const qqq = await this.boardRepository.findOne(
    //   { boardId: board.boardId },
    //   {
    //     relations: ['boardSides'],
    //   },
    // );

    // console.log(qqq);
  }

  async loginCreate({ currentUser, createBoardInput, createBoardTagsInput }) {
    const { boardTagMenu, boardTagRegion, boardTagTogether } =
      createBoardTagsInput;

    const boardTags = [];

    if (boardTagMenu) {
      boardTagMenu.reduce(async (acc: string, cur: string) => {
        const menu = cur.substring(1);
        const menuData = await this.boardTagRepository.findOne({
          boardTagMenu: menu,
        });
        boardTags.push(menuData);
      }, '');
    }

    if (boardTagRegion) {
      boardTagRegion.reduce(async (acc: string, cur: string) => {
        const region = cur.substring(1);
        const regionData = await this.boardTagRepository.findOne({
          boardTagRegion: region,
        });
        boardTags.push(regionData);
      }, '');
    }

    if (boardTagTogether) {
      boardTagTogether.reduce(async (acc: string, cur: string) => {
        const together = cur.substring(1);
        const togetherData = await this.boardTagRepository.findOne({
          boardTagTogether: together,
        });
        boardTags.push(togetherData);
      }, '');
    }
    const user = await getConnection()
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where({ userId: currentUser.userId })
      .getOne();

    const result = await this.boardRepository.save({
      ...createBoardInput,
      boardWriter: user.userNickname,
      user: currentUser.userId,
      boardTags,
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
