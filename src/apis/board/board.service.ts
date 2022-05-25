import {
  Injectable,
  CACHE_MANAGER,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Cache } from 'cache-manager';
import { BoardSide } from '../boardSide/entities/boardSide.entity';
import { BoardTag } from '../boardTag/entities/boardTag.entity';
import { SubCategory } from '../subCategory/entities/subCategory.entity';
import { User } from '../user/entities/user.entity';
import { Board } from './entities/board.entity';

import { Place } from '../place/entities/place.entity';
import { Image } from '../image/entities/image.entity';
import { BoardLike } from '../boardLike/entities/boardLike.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private readonly elasticsearchService: ElasticsearchService,
    @InjectRepository(BoardTag)
    private readonly boardTagRepository: Repository<BoardTag>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async test({ title }) {
    return await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .where(`board.boardTitle like (:data)`, {
        data: `%${title}%`,
      })
      .getMany();
  }

  async best({ category }) {
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);
    const start = new Date(end);
    start.setDate(end.getDate() - 30);

    const qb = await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .where(
        `createAt BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'`,
      )
      .leftJoinAndSelect('board.place', 'place');

    if (category === ('VISITED' || 'REVIEW')) {
      return qb
        .andWhere({ boardSubject: 'VISITED' })
        .orWhere({ boardSubject: 'REVIEW' })
        .orderBy('boardLikeCount', 'DESC')
        .addOrderBy('createAt', 'DESC')
        .limit(3)
        .getMany();
    } else {
      return qb
        .andWhere({ boardSubject: category })
        .orderBy('boardLikeCount', 'DESC')
        .addOrderBy('createAt', 'DESC')
        .limit(3)
        .getMany();
    }
  }

  async elasticsearchFindTags({ tags }) {
    const sortingData = tags.sort();

    const tagsData = sortingData.reduce((acc, cur) => {
      return acc === '' ? acc + cur : acc + ' ' + cur;
    }, '');
    const redisInData = await this.cacheManager.get(tagsData);
    if (redisInData) {
      return redisInData;
    } else {
      const data = await this.elasticsearchService.search({
        index: 'board',
        size: 10000,
        sort: 'createat:desc',
        _source: [
          'boardtitle',
          'boardwriter',
          'boardlikecount',
          'boardhit',
          'createat',
          'boardid',
          'thumbnail',
          'boardsubject',
        ],
        query: {
          multi_match: {
            query: tagsData,
            type: 'cross_fields',
            operator: 'AND',
            fields: ['tags', 'boardsubject'],
          },
        },
      });

      await this.cacheManager.set(tagsData, data, { ttl: 10 });
      return data;
    }
  }

  async elasticsearchFindTitle({ title }) {
    const redisInData = await this.cacheManager.get(title);
    if (redisInData) {
      return redisInData;
    } else {
      const data = await this.elasticsearchService.search({
        index: 'board',
        size: 10000,
        sort: 'createat:desc',
        _source: [
          'boardtitle',
          'boardwriter',
          'boardlikecount',
          'boardhit',
          'createat',
          'boardid',
          'thumbnail',
          'boardsubject',
        ],
        query: {
          match: {
            boardtitle: title,
          },
        },
      });
      await this.cacheManager.set(title, data, { ttl: 10 });
      return data;
    }
  }

  async elasticsearchFindContents({ contents }) {
    const redisInData = await this.cacheManager.get(contents);
    if (redisInData) {
      return redisInData;
    } else {
      const data = await this.elasticsearchService.search({
        index: 'board',
        size: 10000,
        sort: 'createat:desc',
        _source: [
          'boardtitle',
          'boardwriter',
          'boardlikecount',
          'boardhit',
          'createat',
          'boardid',
          'thumbnail',
          'boardsubject',
        ],
        query: {
          match: {
            boardcontents: contents,
          },
        },
      });
      await this.cacheManager.set(contents, data, { ttl: 10 });

      return data;
    }
  }

  async findAll() {
    return await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.subCategory', 'subCategory')
      .leftJoinAndSelect('board.boardSides', 'boardSide')
      .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
      .leftJoinAndSelect('board.place', 'place')
      .orderBy('createAt', 'DESC')
      .getMany();
  }

  async findOne({ boardId, ip }) {
    const isIp = await this.cacheManager.get(boardId);

    if (isIp === null) {
      await this.cacheManager.set(boardId, ip, { ttl: 30 });

      await getConnection()
        .createQueryBuilder()
        .update(Board)
        .set({ boardHit: () => `boardHit+1` })
        .where({ boardId })
        .execute();

      return await getConnection()
        .createQueryBuilder()
        .select('board')
        .from(Board, 'board')
        .leftJoinAndSelect('board.subCategory', 'subCategory')
        .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
        .leftJoinAndSelect('board.boardSides', 'boardSide')
        .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
        .leftJoinAndSelect('board.images', 'image')
        .leftJoinAndSelect('board.place', 'place')
        .orderBy('boardTag.boardTagRefName', 'ASC')
        .where({ boardId })
        .getOne();
    } else {
      return await getConnection()
        .createQueryBuilder()
        .select('board')
        .from(Board, 'board')
        .leftJoinAndSelect('board.subCategory', 'subCategory')
        .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
        .leftJoinAndSelect('board.boardSides', 'boardSide')
        .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
        .leftJoinAndSelect('board.images', 'image')
        .leftJoinAndSelect('board.place', 'place')
        .orderBy('boardTag.boardTagRefName', 'ASC')
        .where({ boardId })
        .getOne();
    }
  }

  async findPickList({ category }) {
    if (category === 'REVIEW') {
      return await getConnection()
        .createQueryBuilder()
        .select('board')
        .from(Board, 'board')
        .leftJoinAndSelect('board.subCategory', 'subCategory')
        .leftJoinAndSelect('board.boardSides', 'boardSide')
        .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
        .leftJoinAndSelect('board.place', 'place')
        .where('subCategoryName = :category1', {
          category1: 'REVIEW',
        })
        .orWhere('subCategoryName = :category2', {
          category2: 'VISITED',
        })
        .orderBy('createAt', 'DESC')
        .getMany();
    }
    return await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.subCategory', 'subCategory')
      .leftJoinAndSelect('board.boardSides', 'boardSide')
      .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
      .leftJoinAndSelect('board.place', 'place')
      .where('subCategoryName = :category', {
        category: category,
      })
      .orderBy('createAt', 'DESC')
      .getMany();
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

  async findLikeBoard({ currentUser }) {
    return await getConnection()
      .createQueryBuilder()
      .select('boardLike')
      .from(BoardLike, 'boardLike')
      .leftJoinAndSelect('boardLike.board', 'board')
      .leftJoinAndSelect('board.place', 'place')
      .where('boardLike.user = :data', { data: currentUser.userId })
      .getMany();
  }

  async findUser({ userNickname }) {
    return await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoin('board.user', 'user')
      .leftJoinAndSelect('board.place', 'place')
      .where('userNickname = :data', { data: userNickname })
      .orderBy('board.createAt', 'DESC')
      .getMany();
  }
  // async findTest({ boardTagsInput }) {
  //   const { boardTagMenu, boardTagRegion, boardTagTogether } = boardTagsInput;

  //   const q = await getConnection()
  //     .createQueryBuilder()
  //     .select('board')
  //     .from(Board, 'board')
  //     .leftJoinAndSelect('board.boardSides', 'boardSide')
  //     .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
  //     .where('boardTag.boardTagName = :boardTagName1', {
  //       boardTagName1: '닭고기',
  //     })
  //     .orWhere('boardTag.boardTagName = :boardTagName2', {
  //       boardTagName2: '피자',
  //     })
  //     .getMany();

  //   console.log(q);

  //   return;
  // }

  async create({ createBoardInput, boardTagsInput, currentUser }) {
    const { boardTagMenu, boardTagRegion, boardTagMood } = boardTagsInput;
    const { subCategoryName, place, ...inputData } = createBoardInput;

    const pattern = new RegExp(
      /(image__data)\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,4}(\/\S*)?/,
      'gi',
    );

    const imageData = [...inputData.boardContents.matchAll(pattern)];

    const subCategory = await getConnection()
      .createQueryBuilder()
      .select('subCategory')
      .from(SubCategory, 'subCategory')
      .where({ subCategoryName })
      .getOne();

    const isPlace = await getConnection()
      .createQueryBuilder()
      .select('place')
      .from(Place, 'place')
      .where({ placeName: place.placeName })
      .getOne();

    if (!isPlace) {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Place)
        .values({
          ...place,
        })
        .execute();
    }

    const placeData = await getConnection()
      .createQueryBuilder()
      .select('place')
      .from(Place, 'place')
      .where({ placeName: place.placeName })
      .getOne();

    const userData = await getConnection()
      .createQueryBuilder()
      .select([
        'user.userId',
        'user.userNickname',
        'user.ageGroup',
        'user.gender',
      ])
      .from(User, 'user')
      .where({ userId: currentUser.userId })
      .getOne();

    const board = await this.boardRepository.save({
      ...inputData,
      subCategory,
      ageGroup: userData.ageGroup,
      gender: userData.gender,
      boardWriter: userData.userNickname,
      user: { userId: userData.userId },
      thumbnail: imageData[0][0],
      place: placeData,
      boardSubject: subCategory.subCategoryName,
    });

    await Promise.all([
      boardTagMenu.reduce(async (acc, cur) => {
        const menuData = await this.boardTagRepository.findOne({
          boardTagName: cur,
        });
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(BoardSide)
          .values({
            boards: board.boardId,
            boardTags: menuData,
          })
          .execute();
      }, ''),

      boardTagRegion.reduce(async (acc, cur) => {
        const regionData = await this.boardTagRepository.findOne({
          boardTagName: cur,
        });
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(BoardSide)
          .values({
            boards: board.boardId,
            boardTags: regionData,
          })
          .execute();
      }, ''),
      boardTagMood.reduce(async (acc, cur) => {
        const moodData = await this.boardTagRepository.findOne({
          boardTagName: cur,
        });
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(BoardSide)
          .values({
            boards: board.boardId,
            boardTags: moodData,
          })
          .execute();
      }, ''),
      imageData.reduce(async (acc, cur) => {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Image)
          .values({
            board: board.boardId,
            url: cur[0],
          })
          .execute();
      }, ''),
    ]);

    return board;
  }

  async update({ boardId, updateBoardInput, boardTagsInput }) {
    const board = await this.boardRepository.findOne({
      where: { boardId },
    });

    const newBoard = {
      ...board,
      ...updateBoardInput,
    };
    return await this.boardRepository.save(newBoard);
  }

  async delete({ boardId, currentUser }) {
    const userData = await getConnection()
      .createQueryBuilder()
      .select('user.userId')
      .from(User, 'user')
      .where({ userId: currentUser.userId })
      .getOne();

    const boardData = await this.boardRepository.findOne({
      where: {
        boardId,
      },
      relations: ['user'],
    });

    if (
      userData.userId === boardData.user.userId ||
      userData.userState === true
    ) {
      await this.elasticsearchService.delete({
        index: 'board',
        id: boardId,
      });

      const relationsData = await this.boardRepository.findOne({
        where: {
          boardId,
        },
        relations: ['images', 'boardSides'],
      });

      await this.boardRepository.softRemove(relationsData);

      return true;
    } else {
      throw new ConflictException('작성자가 아닙니다!');
    }
  }
}

// async createaaa({ createBoardInput, boardTagsInput }) {
//   const { boardTagMenu, boardTagRegion, boardTagMood } = boardTagsInput;
//   const { subCategoryName, url, place, ...inputData } = createBoardInput;

//   const pattern = new RegExp(
//     /(image__data)\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,4}(\/\S*)?/,
//     'gi',
//   );

//   const imageData = [...inputData.boardContents.matchAll(pattern)];
//   // console.log(imageData);

//   // // const pattern = /(image__data)\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,4}(\/\S*)?/;

//   // const thumbnail = pattern.exec(inputData.boardContents)[0];

//   const subCategory = await getConnection()
//     .createQueryBuilder()
//     .select('subCategory')
//     .from(SubCategory, 'subCategory')
//     .where({ subCategoryName })
//     .getOne();

//   const isPlace = await getConnection()
//     .createQueryBuilder()
//     .select('place')
//     .from(Place, 'place')
//     .where({ placeName: place.placeName })
//     .getOne();

//   if (!isPlace) {
//     await getConnection()
//       .createQueryBuilder()
//       .insert()
//       .into(Place)
//       .values({
//         ...place,
//       })
//       .execute();
//   }

//   const placeData = await getConnection()
//     .createQueryBuilder()
//     .select('place')
//     .from(Place, 'place')
//     .where({ placeName: place.placeName })
//     .getOne();

//   const board = await this.boardRepository.save({
//     ...inputData,
//     subCategory,
//     thumbnail: imageData[0][0],
//     place: placeData,
//     boardSubject: subCategory.subCategoryName,
//   });

//   await Promise.all([
//     boardTagMenu.reduce(async (acc, cur) => {
//       const menuData = await this.boardTagRepository.findOne({
//         boardTagName: cur,
//       });
//       await getConnection()
//         .createQueryBuilder()
//         .insert()
//         .into(BoardSide)
//         .values({
//           boards: board.boardId,
//           boardTags: menuData,
//         })
//         .execute();
//     }, ''),

//     boardTagRegion.reduce(async (acc, cur) => {
//       const regionData = await this.boardTagRepository.findOne({
//         boardTagName: cur,
//       });
//       await getConnection()
//         .createQueryBuilder()
//         .insert()
//         .into(BoardSide)
//         .values({
//           boards: board.boardId,
//           boardTags: regionData,
//         })
//         .execute();
//     }, ''),
//     boardTagMood.reduce(async (acc, cur) => {
//       const moodData = await this.boardTagRepository.findOne({
//         boardTagName: cur,
//       });
//       await getConnection()
//         .createQueryBuilder()
//         .insert()
//         .into(BoardSide)
//         .values({
//           boards: board.boardId,
//           boardTags: moodData,
//         })
//         .execute();
//     }, ''),
//     imageData.reduce(async (acc, cur) => {
//       await getConnection()
//         .createQueryBuilder()
//         .insert()
//         .into(Image)
//         .values({
//           board: board.boardId,
//           url: cur[0],
//         })
//         .execute();
//     }, ''),
//   ]);

//   return board;
// }
