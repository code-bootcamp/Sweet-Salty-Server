import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { Repository } from 'typeorm';
import { BoardTag } from './entities/boardTag.entity';

@Injectable()
export class BoardTagService {
  constructor(
    @InjectRepository(BoardTag)
    private readonly boardTagRepository: Repository<BoardTag>,
  ) {}

  async create({ createBoardTagsInput }) {
    const { boardTagMenu, boardTagRegion, boardTagTogether } =
      createBoardTagsInput;

    await Promise.all([
      boardTagMenu.map(async (el: string) => {
        const menu = el.substring(1);
        const checkMenu = await this.boardTagRepository.findOne({
          boardTagMenu: menu,
        });
        if (!checkMenu) {
          await this.boardTagRepository.save({
            boardTagMenu: menu,
          });
        }
      }),

      boardTagRegion.map(async (el: string) => {
        const region = el.substring(1);
        const checkRegion = await this.boardTagRepository.findOne({
          boardTagRegion: region,
        });
        if (!checkRegion) {
          await this.boardTagRepository.save({
            boardTagRegion: region,
          });
        }
      }),

      boardTagTogether.map(async (el: string) => {
        const together = el.substring(1);
        const checkTogether = await this.boardTagRepository.findOne({
          boardTagTogether: together,
        });
        if (!checkTogether) {
          await this.boardTagRepository.save({
            boardTagTogether: together,
          });
        }
      }),
    ]);

    return '반영되었습니다. 디비보시등가';
  }
}
