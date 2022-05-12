import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { BoardTag } from '../boardTag/entities/boardTag.entity';
import { User } from '../user/entities/user.entity';
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

  async findTest({ boardTagsInput }) {
    console.log(boardTagsInput);

    const check = await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.boardTags', 'boardTag')
      .getMany();

    console.log(check);

    const arr = [];

    for (const array of check) {
      const overlap = array.boardTags.filter((el) =>
        el.boardTagMenu.includes('닭고기') ? true : false,
      );

      if (overlap) {
        arr.push(array);
      }
    }

    return arr;

    // const www = check.filter((el) => {
    //   return el.boardTags[0].boardTagTogether === '애인' ? true : false;
    // });
    // console.log(www);
    // const qqq = check.map((el) => el.boardTags);
    // console.log(qqq);

    // check.forEach((el) => console.log(el));
    // const www = []

    // for (const data of check) {
    //   const daaaa = data.boardTags.filter((el) =>
    //     el.boardTagMenu.includes('닭고기') ? true : false,
    //   );
    //   if(daaaa){

    //   }
    // }
    // const www = data.boardTags.map((el) =>
    //   el.boardTagMenu.includes('닭고기'),
    // );
    // console.log(www);

    // // .where({ boardTag_boardTagMenu: '치킨' })
    // .getRawMany();

    // console.log(aaa);

    // return aaa;

    // console.log(menu);

    // const test = await getConnection()
    //   .createQueryBuilder()
    //   .select('board')
    //   .from(Board, 'board')
    //   .innerJoinAndSelect('cart.user', 'user')
    //   .innerJoinAndSelect('cart.product', 'product')
    //   .where({ boardTags: menu.boardTagId })
    //   .getMany();

    // console.log(test);
  }

  async create({ createBoardInput }) {
    const result = await this.boardRepository.save({
      ...createBoardInput,
    });
    return result;
  }

  async loginCreate({ currentUser, createBoardInput, createBoardTagsInput }) {
    const { boardTagMenu, boardTagRegion, boardTagTogether } =
      createBoardTagsInput;

    const board_Tags = [];

    await Promise.all([
      boardTagMenu.map(async (el: string) => {
        const data: Promise<object> = new Promise(async (resolve, reject) => {
          const menu = el.substring(1);
          const menuData = await getConnection()
            .createQueryBuilder()
            .select('boardTag')
            .from(BoardTag, 'boardTag')
            .where({ boardTagMenu: menu })
            .getOne();
          if (menuData) {
            resolve(menuData);
          } else {
            reject(
              getConnection()
                .createQueryBuilder()
                .insert()
                .into(BoardTag)
                .values({ boardTagMenu: menu })
                .execute(),
            );
          }
          board_Tags.push(await data);
          return data;
        });
      }),
      boardTagRegion.map(async (el: string) => {
        const data: Promise<object> = new Promise(async (resolve, reject) => {
          const region = el.substring(1);
          const regionData = await getConnection()
            .createQueryBuilder()
            .select('boardTag')
            .from(BoardTag, 'boardTag')
            .where({ boardTagRegion: region })
            .getOne();
          if (regionData) {
            resolve(regionData);
          } else {
            reject(
              getConnection()
                .createQueryBuilder()
                .insert()
                .into(BoardTag)
                .values({ boardTagRegion: region })
                .execute(),
            );
          }
          board_Tags.push(await data);
          return data;
        });
      }),
      boardTagTogether.map(async (el: string) => {
        const data: Promise<object> = new Promise(async (resolve, reject) => {
          const together = el.substring(1);
          const togetherData = await getConnection()
            .createQueryBuilder()
            .select('boardTag')
            .from(BoardTag, 'boardTag')
            .where({ boardTagTogether: together })
            .getOne();
          if (togetherData) {
            resolve(togetherData);
          } else {
            reject(
              getConnection()
                .createQueryBuilder()
                .insert()
                .into(BoardTag)
                .values({ boardTagTogether: together })
                .execute(),
            );
          }
          board_Tags.push(await data);

          return data;
        });
      }),
    ]);

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
      boardTags: board_Tags,
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
