import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Follow } from './entities/follow.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ followingUserId, followerNickname }) {
    const checkNickname = await this.userRepository.findOne({
      userNickname: followerNickname,
    });

  
    const checkFollow = await this.followRepository.findOne({
      followerId: checkNickname.userId,
    });

    const checkFollowing = await this.followRepository.findOne({
      followingId: followingUserId,
    });

    if (checkFollow && checkFollowing) {
      await this.followRepository.delete({
        followId: checkFollow.followId,
      });

      return `언팔로우`;
    }

    await this.followRepository.save({
      followerId: checkNickname.userId,
      followingId: followingUserId,
    });

    return `팔로우`;
  }

  async count({ followingUserId, followerNickname }) {
    const checkNickname = await this.userRepository.findOne({
      userNickname: followerNickname,
    });

    const followerCount = await this.followRepository.findAndCount({
      followerId: checkNickname.userId,
    });

    followerCount[1];

    const followingCount = await this.followRepository.findAndCount({
      followingId: followingUserId,
    });

    followingCount[1];

    return [`팔로잉`, followerCount[1], `팔로워`, followingCount[1]];
  }
}
