import { UseGuards } from '@nestjs/common';
import { Args, Field, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { Fallow } from './entities/follow.entity';
import { FallowService } from './fallow.service';

@Resolver()
export class FallowResolver {
  constructor(private readonly fallowService: FallowService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Fallow)
  async fallow(
    @CurrentUser() fallowingUserId: ICurrentUser, //
    @Args('fallowerNickname') fallowerNickname: string,
  ) {
    return this.fallowService.create({ fallowingUserId, fallowerNickname });
  }
}
