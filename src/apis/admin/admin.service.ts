import { ConflictException, Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { BoardTag } from '../boardTag/entities/boardTag.entity';
import { SubCategory } from '../subCategory/entities/subCategory.entity';
import { TopCategory } from '../topCategory/entities/topCategory.entity';

@Injectable()
export class AdminService {
  async createTag({ createBoardTagsInput }) {
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

  async createTopCategory() {
    const checkData = await getConnection()
      .createQueryBuilder()
      .select()
      .from(TopCategory, 'topCategory')
      .getMany();

    if (checkData) throw new ConflictException('이미 생성되었습니다.');

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(TopCategory)
      .values({ topCategoryName: 'NOTICE' })
      .execute();

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(TopCategory)
      .values({ topCategoryName: 'COMMUNITY' })
      .execute();

    return 'NOTICE, COMMUNITY 2개의 상위 카테고리가 생성되었습니다.';
  }

  async createSubCategory() {
    const checkData = await getConnection()
      .createQueryBuilder()
      .select('subCategory')
      .from(SubCategory, 'subCategory')
      .getMany();

    if (checkData) throw new ConflictException('이미 생성되었습니다.');

    const Notice = await getConnection()
      .createQueryBuilder()
      .select('topCategory')
      .from(TopCategory, 'topCategory')
      .where({ topCategoryName: 'NOTICE' })
      .getOne();

    const Community = await getConnection()
      .createQueryBuilder()
      .select('topCategory')
      .from(TopCategory, 'topCategory')
      .where({ topCategoryName: 'COMMUNITY' })
      .getOne();

    const CommunityBoard = ['REVIEW', 'REQUEST', 'VISITED', 'TASTER'];

    const NoticeBoard = ['All', 'NOTICE', 'EVENT', 'PROMOTION', 'TASTING'];

    CommunityBoard.map(async (el) => {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(SubCategory)
        .values({ subCategoryName: el, topCategories: Notice })
        .execute();
    });

    NoticeBoard.map(async (el) => {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(SubCategory)
        .values({ subCategoryName: el, topCategories: Community })
        .execute();
    });
    console.log('aa');

    return '생성되었습니다.';
  }
}
