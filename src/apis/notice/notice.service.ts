import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Image } from '../image/entities/image.entity';
import { SubCategory } from '../subCategory/entities/subCategory.entity';
import { Notice } from './entities/notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}
  async create({ createNoticeInput }) {
    const { noticeCategory, url, ...data } = createNoticeInput;

    // const isAdmin = await getConnection()
    //   .createQueryBuilder()
    //   .select('user')
    //   .from(User, 'user')
    //   .where({ userId: currentUser.userId })
    //   .getOne();

    // if (isAdmin.userState === false)
    //   throw new ConflictException('관리자만 글을 작성할 수 있습니다.');

    const category = await getConnection()
      .createQueryBuilder()
      .select('subCategory')
      .from(SubCategory, 'subCategory')
      .where({ subCategoryName: noticeCategory })
      .getOne();

    const notice = await this.noticeRepository.save({
      ...data,
      subCategory: category,
    });

    if (url) {
      url.reduce(async (acc, cur) => {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Image)
          .values({
            notice: notice.noticeId,
            url: cur,
          })
          .execute();
      }, '');
    }

    return notice;
  }

  async findOne({ noticeId }) {
    return await this.noticeRepository.findOne({
      where: {
        noticeId,
      },
    });
  }

  async findPick({ page, category }) {
    if (!page) {
      return await getConnection()
        .createQueryBuilder()
        .select('notice')
        .from(Notice, 'notice')
        .leftJoinAndSelect('notice.subCategory', 'subCategory')
        .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
        .where('subCategoryName = :data', {
          data: category,
        })
        .offset(0)
        .limit(10)
        .orderBy('createAt', 'DESC')
        .getMany();
    } else {
      return await getConnection()
        .createQueryBuilder()
        .select('notice')
        .from(Notice, 'notice')
        .leftJoinAndSelect('notice.subCategory', 'subCategory')
        .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
        .where('subCategoryName = :data', {
          data: category,
        })
        .offset((page - 1) * 10)
        .limit(10)
        .orderBy('createAt', 'DESC')
        .getMany();
    }
  }

  async findALL({ page }) {
    if (!page) {
      return await getConnection()
        .createQueryBuilder()
        .select('notice')
        .from(Notice, 'notice')
        .leftJoinAndSelect('notice.subCategory', 'subCategory')
        .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
        .where('topCategoryName = :data', {
          data: 'NOTICE',
        })
        .offset(0)
        .limit(10)
        .orderBy('createAt', 'DESC')
        .getMany();
    } else {
      return await getConnection()
        .createQueryBuilder()
        .select('notice')
        .from(Notice, 'notice')
        .leftJoinAndSelect('notice.subCategory', 'subCategory')
        .leftJoinAndSelect('subCategory.topCategory', 'topCategory')
        .where('topCategoryName = :data', {
          data: 'NOTICE',
        })
        .offset((page - 1) * 10)
        .limit(10)
        .orderBy('createAt', 'DESC')
        .getMany();
    }
  }

  async getCount({ category }) {
    if (category === 'ALL') {
      return await getConnection()
        .createQueryBuilder()
        .from(Notice, 'notice')
        .getCount();
    } else {
      return await getConnection()
        .createQueryBuilder()
        .from(Notice, 'notice')
        .leftJoin('notice.subCategory', 'subCategory')
        .where('subCategoryName = :data', {
          data: category,
        })
        .getCount();
    }
  }
}
