import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Fallow } from './entities/follow.entity';

@Injectable()
export class FallowService {
  constructor(
    @InjectRepository(Fallow)
    private readonly fallowRepository: Repository<Fallow>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ fallowingUserId, fallowerNickname }) {
    const checkNickname = await this.userRepository.findOne({
      userNickname: fallowerNickname,
    });

    const checkFallower = await this.fallowRepository.findOne({
      fallowerId: checkNickname.userId,
    });

    console.log(checkNickname.userId);

    console.log(fallowingUserId.userId);

    return await this.fallowRepository.save({
      fallowerId: checkNickname.userId,
      fallowingId: checkNickname.userId,
    });
  }
}
