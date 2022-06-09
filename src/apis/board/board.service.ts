import {
  Injectable,
  CACHE_MANAGER,
  Inject,
  ConflictException,
  UnauthorizedException,
  Ip,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, getConnection, getRepository, Repository } from 'typeorm';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Cache } from 'cache-manager';
import { BoardSide } from '../boardSide/entities/boardSide.entity';
import { BoardTag } from '../boardTag/entities/boardTag.entity';
import { SubCategory } from '../subCategory/entities/subCategory.entity';
import { User } from '../user/entities/user.entity';
import { Board } from './entities/board.entity';

import { Place } from '../place/entities/place.entity';
import { Image } from '../image/entities/image.entity';
import { PreferMenu } from '../preferMenu/entities/preferMenu.entity';
import { MessageInfo } from '../messageInfo/entities/messageInfo.entity';
import { Message } from '../message/entitis/message.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(BoardTag)
    private readonly boardTagRepository: Repository<BoardTag>,
    @InjectRepository(BoardSide)
    private readonly boardSideRepository: Repository<BoardSide>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  qb = getConnection()
    .createQueryBuilder()
    .select('board')
    .from(Board, 'board')
    .leftJoinAndSelect('board.subCategory', 'subCategory')
    .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
    .leftJoinAndSelect('board.place', 'place')
    .leftJoinAndSelect('board.user', 'user');

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

  async countBoard({ currentUser }) {
    return await getConnection()
      .createQueryBuilder()
      .from(Board, 'board')
      .where({ user: currentUser.userId })
      .getCount();
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
          'placename',
          'placeaddress',
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
          'placename',
          'placeaddress',
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
          'placename',
          'placeaddress',
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

  async elasticsearch({ title, contents }) {
    const redisInData = await this.cacheManager.get(title);
    if (redisInData) {
      return redisInData;
    } else {
      const data = await this.elasticsearchService.search({
        index: 'board',
        size: 10000,
        sort: 'createat:desc',
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

  async categoryBest({ category }) {
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);
    const start = new Date(end);
    start.setDate(end.getDate() - 30);

    const qb = getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
      .leftJoinAndSelect('board.place', 'place')
      .leftJoinAndSelect('board.user', 'user')
      .where(
        `board.createAt BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'`,
      );

    if (category === ('VISITED' || 'REVIEW')) {
      return await qb
        .andWhere({ boardSubject: 'VISITED' })
        .orWhere({ boardSubject: 'REVIEW' })
        .orderBy('boardLikeCount', 'DESC')
        .addOrderBy('board.createAt', 'DESC')
        .limit(3)
        .getMany();
    }

    return await qb
      .andWhere({ boardSubject: category })
      .orderBy('boardLikeCount', 'DESC')
      .addOrderBy('board.createAt', 'DESC')
      .limit(3)
      .getMany();
  }

  async findAll() {
    return await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
      .leftJoinAndSelect('board.place', 'place')
      .leftJoinAndSelect('board.user', 'user')
      .orderBy('board.createAt', 'DESC')
      .getMany();
  }

  async findOne({ boardId, ip }) {
    const isIp = await this.cacheManager.get(boardId);

    const qb = getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
      .leftJoinAndSelect('board.place', 'place')
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.boardSides', 'boardSide')
      .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
      .orderBy('boardTag.boardTagRefName', 'ASC')
      .where({ boardId });

    if (isIp === null) {
      await this.cacheManager.set(boardId, ip, { ttl: 30 });

      await getConnection()
        .createQueryBuilder()
        .update(Board)
        .set({ boardHit: () => `boardHit+1` })
        .where({ boardId })
        .execute();

      return await qb.getOne();
    } else {
      return await qb.getOne();
    }
  }

  async findPreferList({ currentUser }) {
    const data = await getConnection()
      .createQueryBuilder()
      .select('preferMenu')
      .from(PreferMenu, 'preferMenu')
      .leftJoinAndSelect('preferMenu.boardTag', 'boardTag')
      .where({ user: currentUser.userId })
      .getMany();

    const tag = data.reduce((acc, cur) => {
      return [...acc, cur.boardTag.boardTagName];
    }, []);

    const qb = getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoin('board.boardSides', 'boardSide')
      .leftJoin('boardSide.boardTags', 'boardTag')
      .leftJoinAndSelect('board.place', 'place')
      .leftJoinAndSelect('board.user', 'user')
      .take(10)
      .orderBy('board.boardLikeCount', 'DESC')
      .addOrderBy('board.createAt', 'DESC');

    if (tag.length === 1) {
      return await qb
        .where('boardTag.boardTagName = :data', {
          data: tag[0],
        })
        .getMany();
    }

    if (tag.length === 2) {
      return await qb
        .where('boardTag.boardTagName = :data', {
          data: tag[0],
        })
        .orWhere('boardTag.boardTagName = :data1', {
          data1: tag[1],
        })
        .getMany();
    }

    return await qb
      .where('boardTag.boardTagName = :data', {
        data: tag[0],
      })
      .orWhere('boardTag.boardTagName = :data1', {
        data1: tag[1],
      })
      .orWhere('boardTag.boardTagName = :data2', {
        data2: tag[2],
      })
      .getMany();
  }

  async findPickList({ category }) {
    const qb = getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
      .leftJoinAndSelect('board.place', 'place')
      .leftJoinAndSelect('board.user', 'user');
    if (category === 'REVIEW') {
      return await qb
        .where('subCategoryName = :category1', {
          category1: 'REVIEW',
        })
        .orWhere('subCategoryName = :category2', {
          category2: 'VISITED',
        })
        .orderBy('board.createAt', 'DESC')
        .getMany();
    }

    return await qb
      .where('subCategoryName = :category', {
        category: category,
      })
      .orderBy('board.createAt', 'DESC')
      .getMany();
  }

  async findRecent({ category }) {
    const qb = getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.subCategory', 'subCategory')
      .leftJoinAndSelect('board.boardSides', 'boardSide')
      .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
      .leftJoinAndSelect('board.place', 'place')
      .leftJoinAndSelect('board.user', 'user')
      .take(10)
      .orderBy('board.createAt', 'DESC');

    if (category === 'REVIEW') {
      return await qb.where({ boardSubject: 'REVIEW' }).getMany();
    }

    if (category === 'VISITED') {
      return await qb.where({ boardSubject: 'VISITED' }).getMany();
    }

    if (category === 'REQUEST') {
      return await qb.where({ boardSubject: 'REQUEST' }).getMany();
    }

    if (category === 'TASTER') {
      return await qb.where({ boardSubject: 'TASTER' }).getMany();
    }
  }
  // async findRecent({ category }) {
  //   const qb = await this.qb
  //     .where({ boardSubject: category })
  //     .take(10)
  //     .orderBy('board.createAt', 'DESC')
  //     .getMany();
  //   if (category === 'REVIEW') {
  //     return qb;
  //   }

  //   if (category === 'VISITED') {
  //     return qb;
  //   }

  //   if (category === 'REQUEST') {
  //     return qb;
  //   }

  //   if (category === 'TASTER') {
  //     return qb;
  //   }
  // }

  // async findLikeBoard({ currentUser }) {
  //   return await getConnection()
  //     .createQueryBuilder()
  //     .select('board')
  //     .from(Board, 'board')
  //     .leftJoinAndSelect('board.subCategory', 'subCategory')
  //     .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
  //     .leftJoinAndSelect('board.place', 'place')
  //     .leftJoinAndSelect('board.user', 'user')
  //     .leftJoinAndSelect('board.boardLikes', 'boardLike')
  //     .where('boardLike.user = :data', { data: currentUser.userId })
  //     .getMany();
  // }

  async findLikeBoard({ userNickname }) {
    const user = await getConnection()
      .createQueryBuilder()
      .select('user.userId')
      .from(User, 'user')
      .where({ userNickname })
      .getOne();

    return await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
      .leftJoinAndSelect('board.place', 'place')
      .leftJoinAndSelect('board.user', 'user')
      .leftJoinAndSelect('board.boardLikes', 'boardLike')
      .where('boardLike.user = :data', { data: user.userId })
      .getMany();
  }

  async findUserWithBoard({ userNickname }) {
    return await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
      .leftJoinAndSelect('board.place', 'place')
      .leftJoinAndSelect('board.user', 'user')
      .where('user.userNickname = :data', { data: userNickname })
      .orderBy('board.createAt', 'DESC')
      .getMany();
  }
  // async findTest({ boardTagsInput }) {
  //   const { boardTagMenu, boardTagRegion, boardTagTogether } = boardTagsInput;

  //   const q = await getConnection()
  //     .createQueryBuilder()
  //     .select('board')
  //     .from(Board, 'board')
  //     .leftJoinAndSelect('board.this', 'boardSide')
  //     .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
  //     .where('boardTag.boardTagName = :boardTagName1', {
  //       boardTagName1: '닭고기',
  //     })
  //     .orWhere('boardTag.boardTagName = :boardTagName2', {
  //       boardTagName2: '피자',
  //     })
  //     .getMany();

  //   (q);

  //   return;
  // }

  async create({ createBoardInput, currentUser }) {
    const { subCategoryName, tags, place, ...inputData } = createBoardInput;

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

    const placeData = await this.isPlace({ place });

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
      tags.reduce(async (acc, cur) => {
        const tagData = await this.boardTagRepository.findOne({
          where: {
            boardTagName: cur,
          },
        });

        await getRepository(BoardSide)
          .createQueryBuilder()
          .insert()
          .values({
            boards: board.boardId,
            boardTags: tagData,
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

  async createRes({ createBoardInput, currentUser, reqBoardId }) {
    const { subCategoryName, tags, place, ...inputData } = createBoardInput;

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

    const placeData = await this.isPlace({ place });

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
      tags.reduce(async (acc, cur) => {
        const tagData = await this.boardTagRepository.findOne({
          where: {
            boardTagName: cur,
          },
        });

        await getRepository(BoardSide)
          .createQueryBuilder()
          .insert()
          .values({
            boards: board.boardId,
            boardTags: tagData,
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

    const reqBoard = await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.user', 'user')
      .where({ boardId: reqBoardId })
      .getOne();

    const messageData = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(MessageInfo)
      .values([
        {
          messageInfoContents: `${reqBoard.boardWriter}단짝님께서 가보시길 원하셨던 매장을 ${board.boardWriter}단짝님께서 방문해주셨습니다. 작성된 글은 > < 여기에서 보실 수 있습니다.`,
        },
      ])
      .execute();

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Message)
      .values([
        {
          messageSendUser: '단짠맛집',
          messageSendUserImage:
            'image__data/4bf59999-9a8d-4ce4-83de-ebfde8b4df45.webp',
          sendReceived: 'RECEIVED',
          messageInfo: messageData.identifiers[0].messageInfoId,
          messageOwner: reqBoard.user.userId,
        },
      ])
      .execute();

    return board;
  }

  async createReq({ createBoardReqInput, currentUser }) {
    const pattern = new RegExp(
      /(image__data)\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,4}(\/\S*)?/,
      'gi',
    );
    const { subCategoryName, place, ...inputData } = createBoardReqInput;

    const imageData = [...createBoardReqInput.boardContents.matchAll(pattern)];

    const subCategory = await getConnection()
      .createQueryBuilder()
      .select('subCategory')
      .from(SubCategory, 'subCategory')
      .where({ subCategoryName })
      .getOne();

    const placeData = await this.isPlace({ place });

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

    Promise.all(
      imageData.map(async (el) => {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Image)
          .values({
            board: board.boardId,
            url: el[0],
          })
          .execute();
      }),
    );

    return board;
  }

  async update({ currentUser, boardId, updateBoardInput }) {
    const { subCategoryName, tags, place, ...inputData } = updateBoardInput;
    const board = await this.boardRepository.findOne({
      where: { boardId },
      relations: ['user'],
    });

    if (board.user.userId !== currentUser.userId)
      throw new UnauthorizedException('해당 글의 작성자가 아닙니다.');

    if (place) {
      const newPlace = await this.isPlace({ place });
      await this.boardRepository.update({ boardId }, { place: newPlace });
    }

    if (updateBoardInput.boardContents) {
      this.imageUpdate({ updateBoardInput, board, boardId });
    }

    if (tags) {
      this.tagUpdate({ board, tags, boardId });
    }

    const newBoard = {
      ...board,
      ...inputData,
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

  async searchTags({ tags, category }) {
    let Ids;
    Ids = getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.boardSides', 'boardSide')
      .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
      .leftJoinAndSelect('board.place', 'place')
      .leftJoinAndSelect('board.user', 'user')
      .where('1 = 1')
      .orderBy('board.createAt', 'DESC');

    await Ids.andWhere(
      new Brackets((qb) => {
        tags.forEach((tag: string) => {
          qb.orWhere(`boardTag.boardTagName = "${tag}"`);
        });
      }),
    );

    if (category) {
      Ids.andWhere('board.boardSubject = :subject', {
        subject: category,
      });
    }

    Ids = await Ids.getManyAndCount();

    const [data, count] = Ids;

    const filter = data.filter((el) => {
      return el.boardSides.length === tags.length ? el : false;
    });

    return filter;
  }

  async isPlace({ place }) {
    const isPlace = await this.placeRepository.findOne({
      where: {
        placeName: place.placeName,
      },
    });

    if (!isPlace) {
      return await this.placeRepository.save({
        ...place,
      });
    } else {
      return isPlace;
    }
  }

  async imageUpdate({ updateBoardInput, board, boardId }) {
    const pattern = new RegExp(
      /(image__data)\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,4}(\/\S*)?/,
      'gi',
    );

    const images = [...updateBoardInput.boardContents.matchAll(pattern)];
    const image = await getConnection()
      .createQueryBuilder()
      .select('image.url')
      .from(Image, 'image')
      .where({
        board: board.boardId,
      })
      .getMany();

    await this.boardRepository.update({ boardId }, { thumbnail: images[0][0] });

    const old_url = image.map((el) => {
      return el.url;
    });

    const add_url = images.filter((el) => !old_url.includes(el));
    const delete_url = old_url.filter((el) => !images.includes(el));
    Promise.all([
      add_url.map(async (el) => {
        await this.imageRepository.save({
          url: el,
          board: boardId,
        });
      }),
      delete_url.map(async (el) => {
        const urlData = await this.imageRepository.findOne({
          where: {
            url: el,
            board: boardId,
          },
        });
        await this.imageRepository.softRemove({
          imageId: urlData.imageId,
        });
      }),
    ]);
  }

  async tagUpdate({ board, tags, boardId }) {
    const tag = await getConnection()
      .createQueryBuilder()
      .select('boardTag.boardTagName')
      .from(BoardTag, 'boardTag')
      .leftJoin('boardTag.boardSide', 'boardSide')
      .where('boardSide.boards = :data', {
        data: board.boardId,
      })
      .getMany();

    const old_tag = tag.map((el) => {
      return el.boardTagName;
    });

    const add_tag = tags.filter((el) => !old_tag.includes(el));
    const delete_tag = old_tag.filter((el) => !tags.includes(el));

    Promise.all([
      add_tag.map(async (el) => {
        const tag = await this.boardTagRepository.findOne({
          where: { boardTagName: el },
        });

        await this.boardSideRepository.save({
          boards: boardId,
          boardTags: tag,
        });
      }),
      delete_tag.map(async (el) => {
        const tag = await this.boardTagRepository.findOne({
          where: {
            boardTagName: el,
          },
        });
        const tagSide = await this.boardSideRepository.findOne({
          where: {
            boards: boardId,
            boardTags: tag,
          },
        });
        await this.boardSideRepository.delete({
          boardSideId: tagSide.boardSideId,
        });
      }),
    ]);
  }
}

// if (!boardTagRegion && !boardTagMood) {
//   await Ids.andWhere('boardTag.boardTagName = :menu', {
//     menu: boardTagMenu[0],
//   });
// } else if (!boardTagRegion) {
//   await Ids.andWhere(
//     new Brackets((qb) => {
//       qb.where('boardTag.boardTagName = :menu', {
//         menu: boardTagMenu[0],
//       }).where('boardTag.boardTagName = :mood', {
//         mood: boardTagMood[0],
//       });
//     }),
//   );
// } else if (!boardTagMood) {
//   await Ids.andWhere(
//     new Brackets((qb) => {
//       qb.where('boardTag.boardTagName = :menu', {
//         menu: boardTagMenu[0],
//       }).where('boardTag.boardTagName = :region', {
//         region: boardTagRegion[0],
//       });
//     }),
//   );
// }
