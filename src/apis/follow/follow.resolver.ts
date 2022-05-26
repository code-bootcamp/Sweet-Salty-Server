import { UseGuards } from '@nestjs/common';
import { Args, Field, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { Follow } from './entities/follow.entity';
import { FollowService } from './follow.service';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  async follow(
    @CurrentUser() followingUserId: ICurrentUser, //
    @Args('followerNickname') followerNickname: string,
  ) {
    return this.followService.create({ followingUserId, followerNickname });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [String])
  async followCount(
    @CurrentUser() followingUserId: ICurrentUser, //
    @Args('followerNickname') followerNickname: string,
  ) {
    return this.followService.count({ followingUserId, followerNickname });
  }
}
