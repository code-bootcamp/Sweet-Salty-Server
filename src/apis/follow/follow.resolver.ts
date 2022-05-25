import { UseGuards } from '@nestjs/common';
import { Args, Field, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { Follow } from './entities/follow.entity';
import { FollowService } from './follow.service';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Follow)
  async fallow(
    @CurrentUser() followingUserId: ICurrentUser, //
    @Args('followerNickname') followerNickname: string,
  ) {
    return this.followService.create({ followingUserId, followerNickname });
  }
}
