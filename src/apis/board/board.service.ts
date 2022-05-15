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

    // const q = await getConnection()
    //   .createQueryBuilder()
    //   .select('boardTag')
    //   .from(BoardTag, 'boardTag')
    //   .leftJoinAndSelect('boardTag.boardSides', 'boardSide')
    //   .leftJoinAndSelect('boardSide.boards', 'board')
    //   .where('boardTag.boardTagName = :boardTagName1', {
    //     boardTagName1: '닭고기',
    //   })
    //   .orWhere('boardTag.boardTagName = :boardTagName2', {
    //     boardTagName2: '피자',
    //   })
    //   .getMany();
    // console.log(q);

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

    // const qq = await getConnection()
    //   .createQueryBuilder()
    //   .select('boardSide')
    //   .from(BoardSide, 'boardSide')
    //   .where('boardSide.tagName =:tagName', { tagName: '피자' })
    //   .getMany();

    // const aa = await getConnection()
    //   .createQueryBuilder()
    //   .select('board')
    //   .from(Board, 'board')
    //   .leftJoinAndSelect('board.boardSides', 'boardSide')
    //   // .having('boardSide.tagName = :tagName', { tagName: '닭고기' })
    //   // .andHaving('boardSide.tagName = :tagName', { tagName: '피자' })
    //   .getMany();

    // console.log(aa);
    // return aa;
    // const qq = await getConnection()
    //   .createQueryBuilder()
    //   .select('b')
    //   .from(Board, 'b')
    //   .leftJoinAndMapMany(
    //     'b.boardId',
    //     'b.boardSides',
    //     'boardSide',
    //     'boardSide.tagName',
    //   )
    //   .where({ boardId: '60' })
    //   .getOne();

    // console.log(qq);

    // console.log(qq);

    // const check = await getConnection()
    //   .createQueryBuilder()
    //   .select('boardSide')
    //   .from(BoardSide, 'boardSide')
    //   .innerJoinAndSelect('boardSide.boardTags', 'boardTag')
    //   .where({ boardTagMenu: '치킨' })
    //   .getMany();

    // console.log(check);

    // const eee = await getRepository(BoardSide)
    //   .createQueryBuilder('boardSide')
    //   .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
    //   .where('boardTag.boardTagMenu = :boardTagMenu', {
    //     boardTagMenu: '닭고기',
    //   })
    //   .andWhere('boardTag.boardTagRegion = :boardTagRegion', {
    //     boardTagRegion: '관악구',
    //   })
    //   .getMany();
    //   console.log(eee);

    // const data = await getConnection()
    // .createQueryBuilder()
    // .select('board')
    // .from(Board,'board')

    // const aaa = await getConnection()
    //   .createQueryBuilder()
    //   .select('board')
    //   .from(Board, 'board')
    //   .leftJoinAndSelect('board.boardSides', 'boardSide')
    //   .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
    //   .where('boardTag.boardTagMenu =:boardTagMenu', {
    //     boardTagMenu: '닭고기',
    //   })
    // .andWhere('boardTag.boardTagMenu =:boardTagMenu', {
    //   boardTagMenu: '한식',
    // })
    // .getMany();

    // .andWhere('boardTag.boardTagRegion =:boardTagRegion', {
    //   boardTagRegion: '서울특별시',
    // })

    // console.log(aaa);

    // const check = await getConnection()
    //   .createQueryBuilder()
    //   .select('boardTag')
    //   .from(BoardTag, 'boardTag')
    //   .where({ boardTagMenu: '닭고기' })
    //   .getOne();

    // const data = await getConnection()
    //   .createQueryBuilder()
    //   .select('boardSide')
    //   .from(BoardSide, 'boardSide')
    //   .where({ boardTags: check.boardTagId })
    //   .getMany();

    // // console.log(data);

    // const www = await getRepository(BoardSide)
    //   .createQueryBuilder('boardSide')
    //   .leftJoinAndSelect('boardSide.boards', 'boards')
    //   .leftJoinAndSelect('boardSide.boardTags', 'boardTags')
    //   .where('boardSide.boardSide= :boardSide', {
    //     boardSide: '549ebd5c-3d5d-4440-aed6-5ebd887e4ae7',
    //   })
    //   .getMany();

    // const qqq = await getRepository(BoardTag)
    //   .createQueryBuilder('boardTag')
    //   .leftJoinAndSelect('boardTag.boardSides', 'boardSides')
    //   .leftJoinAndSelect('boardSides.boards', 'boards')
    //   .where({ boardTagMenu: '닭고기' })
    //   .getMany();

    // qqq.map((el) => console.log(el));

    //    console.log(qqq);

    //.where({ boardSides: '549ebd5c-3d5d-4440-aed6-5ebd887e4ae7' })
    // console.log(www);

    // const check = await getConnection()
    //   .createQueryBuilder()
    //   .select('board')
    //   .from(Board, 'board')
    //   .leftJoinAndSelect('board.boardTags', 'boardTag')
    //   .where({ boardTags: '362' })
    //   .getMany();

    // console.log(check);

    return; //arr;
  }

  async create({ createBoardInput, createBoardTagsInput }) {
    const { boardTagMenu, boardTagRegion, boardTagMood } = createBoardTagsInput;

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

  async loginCreate({ currentUser, createBoardInput, createBoardTagsInput }) {
    const { boardTagMenu, boardTagRegion, boardTagTogether } =
      createBoardTagsInput;

    const boardTags = [];

    // if (boardTagMenu) {
    //   boardTagMenu.reduce(async (acc: string, cur: string) => {
    //     const menu = cur.substring(1);
    //     const menuData = await this.boardTagRepository.findOne({
    //       boardTagMenu: menu,
    //     });
    //     boardTags.push(menuData);
    //   }, '');
    // }

    // if (boardTagRegion) {
    //   boardTagRegion.reduce(async (acc: string, cur: string) => {
    //     const region = cur.substring(1);
    //     const regionData = await this.boardTagRepository.findOne({
    //       boardTagRegion: region,
    //     });
    //     boardTags.push(regionData);
    //   }, '');
    // }

    // if (boardTagTogether) {
    //   boardTagTogether.reduce(async (acc: string, cur: string) => {
    //     const together = cur.substring(1);
    //     const togetherData = await this.boardTagRepository.findOne({
    //       boardTagTogether: together,
    //     });
    //     boardTags.push(togetherData);
    //   }, '');
    // }
    // const user = await getConnection()
    //   .createQueryBuilder()
    //   .select('user')
    //   .from(User, 'user')
    //   .where({ userId: currentUser.userId })
    //   .getOne();

    // const result = await this.boardRepository.save({
    //   ...createBoardInput,
    //   boardWriter: user.userNickname,
    //   user: currentUser.userId,
    //   boardTags,
    // });

    // return result;
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
