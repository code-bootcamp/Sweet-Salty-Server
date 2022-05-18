import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { SubCategory } from '../subCategory/entities/subCategory.entity';
import { Notice } from './entities/notice.entity';

@Injectable()
export class noticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}
  async create({ createNoticeInput }) {
    const { noticeCategory, ...data } = createNoticeInput;

    const category = await getConnection()
      .createQueryBuilder()
      .select('subCategory')
      .from(SubCategory, 'subCategory')
      .where({ subCategoryName: noticeCategory })
      .getOne();

    // return await this.noticeRepository.save({
    //   ...data,
    //   subCategory: category,
    // });

    // const aaa = await this.noticeRepository.find({
    //   where: {
    //     noticeId: 'b2e6f0ac-0527-4795-8eb3-677dff85ab2d',
    //   },
    //   relations: ['subCategory'],
    // });
    // console.log(aaa);

    const qq = await getConnection()
      .createQueryBuilder()
      .select('notice')
      .from(Notice, 'notice')
      .leftJoinAndSelect('notice.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.topCategories', 'topCategory')
      .where('topCategoryName = :data', {
        data: 'COMMUNITY',
      })
      .getMany();

    console.log(qq);
  }
}
