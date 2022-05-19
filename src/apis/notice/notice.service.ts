import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { SubCategory } from '../subCategory/entities/subCategory.entity';
import { User } from '../user/entities/user.entity';
import { Notice } from './entities/notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}
  async create({ createNoticeInput, currentUser }) {
    const { noticeCategory, ...data } = createNoticeInput;

    const isAdmin = await getConnection()
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where({ userId: currentUser.userId })
      .getOne();

    if (isAdmin.userState === false)
      throw new ConflictException('관리자만 글을 작성할 수 있습니다.');

    const category = await getConnection()
      .createQueryBuilder()
      .select('subCategory')
      .from(SubCategory, 'subCategory')
      .where({ subCategoryName: noticeCategory })
      .getOne();

    await this.noticeRepository.save({
      ...data,
      subCategory: category,
    });
    return '글이 생성되었습니다.';
  }

  async findOne({ noticeId }) {
    return await this.noticeRepository.findOne({
      where: {
        noticeId,
      },
    });
  }

  async findPick({ page, category }) {
    return await getConnection()
      .createQueryBuilder()
      .select('notice')
      .from(Notice, 'notice')
      .leftJoinAndSelect('notice.subCategory', 'subCategory')
      .where('subCategoryName = :data', {
        data: category,
      })
      .offset((page - 1) * 10)
      .limit(10)
      .orderBy('createAt', 'DESC')
      .getMany();
  }

  async findALL({ page }) {
    return await getConnection()
      .createQueryBuilder()
      .select('notice')
      .from(Notice, 'notice')
      .leftJoinAndSelect('notice.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.topCategories', 'topCategory')
      .where('topCategoryName = :data', {
        data: 'NOTICE',
      })
      .offset((page - 1) * 10)
      .limit(10)
      .orderBy('createAt', 'DESC')
      .getMany();
  }
}
