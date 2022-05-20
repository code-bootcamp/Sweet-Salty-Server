import {
  ConflictException,
  Injectable,
  CACHE_MANAGER,
  Inject,
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

  async elasticsearchFindTags({ tags }) {
    const tagsData = tags.reduce((acc, cur) => {
      return acc === '' ? acc + cur : acc + ' ' + cur;
    }, '');
    console.log(tagsData);
    const redisInData = await this.cacheManager.get(tagsData);
    if (redisInData) {
      return redisInData;
    } else {
      const data = await this.elasticsearchService.search({
        index: 'board',
        size: 10000,
        sort: 'sortData',
        _source: [
          'boardtitle',
          'boardwriter',
          'boardlikecount',
          'boardhit',
          'createat',
          'boardid',
        ],
        query: {
          match: {
            tags: {
              query: tagsData,
              operator: 'and',
            },
          },
        },
      });
      await this.cacheManager.set(tagsData, data, { ttl: 20 });
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
      .orderBy('createAt', 'DESC')
      .getMany();
  }

  async findOne({ boardId, ip }) {
    const isIp = await this.cacheManager.get(boardId);

    if (isIp === null) {
      await this.cacheManager.set(boardId, ip, { ttl: 10 });

      await getConnection()
        .createQueryBuilder()
        .update(Board)
        .set({ boardHit: () => `boardHit+1` })
        .where({ boardId })
        .execute();

      return await this.boardRepository.findOne({ boardId });
    } else {
      return await this.boardRepository.findOne({ boardId });
    }
  }

  async findPickList({ category }) {
    return await getConnection()
      .createQueryBuilder()
      .select('board')
      .from(Board, 'board')
      .leftJoinAndSelect('board.subCategory', 'subCategory')
      .leftJoinAndSelect('board.boardSides', 'boardSide')
      .leftJoinAndSelect('boardSide.boardTags', 'boardTag')
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
    const { subCategoryName, ...inputData } = createBoardInput;

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

    const subCategory = await getConnection()
      .createQueryBuilder()
      .select('subCategory')
      .from(SubCategory, 'subCategory')
      .where({ subCategoryName })
      .getOne();

    const board = await this.boardRepository.save({
      ...inputData,
      subCategory,
      ageGroup: userData.ageGroup,
      gender: userData.gender,
      boardWriter: userData.userNickname,
      user: { userId: userData.userId },
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

      await this.boardRepository.softDelete({
        boardId,
      });

      return true;
    } else {
      throw new ConflictException('작성자가 아닙니다!');
    }
  }
}
