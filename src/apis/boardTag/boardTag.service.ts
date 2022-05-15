import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { BoardTag } from './entities/boardTag.entity';

@Injectable()
export class BoardTagService {
  constructor(
    @InjectRepository(BoardTag)
    private readonly boardTagRepository: Repository<BoardTag>,
  ) {}

  async create({ createBoardTagsInput }) {
    const { boardTagMenu, boardTagRegion, boardTagMood } = createBoardTagsInput;

    await Promise.all([
      boardTagMenu.map(async (el) => {
        const menu = el.substring(1);

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(BoardTag)
          .values({
            boardTagName: menu,
            boardTagRefCode: 'MENU',
          })
          .execute();
      }),
      boardTagRegion.map(async (el) => {
        const region = el.substring(1);

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(BoardTag)
          .values({
            boardTagName: region,
            boardTagRefCode: 'REGION',
          })
          .execute();
      }),

      boardTagMood.map(async (el) => {
        const mood = el.substring(1);

        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(BoardTag)
          .values({
            boardTagName: mood,
            boardTagRefCode: 'MOOD',
          })
          .execute();
      }),
    ]);

    return '반영되었습니다. 디비보시등가';
  }
}
