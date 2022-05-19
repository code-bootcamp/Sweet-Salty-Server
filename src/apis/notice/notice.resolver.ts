import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { CreateNoticeInput } from './dto/createNotice.input';
import { Notice } from './entities/notice.entity';
import { NoticeService } from './notice.service';

@Resolver()
export class NoticeResolver {
  constructor(private readonly noticeService: NoticeService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  createNotice(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createNoticeInput') createNoticeInput: CreateNoticeInput,
  ) {
    return this.noticeService.create({ createNoticeInput, currentUser });
  }

  @Query(() => [Notice])
  fetchNoticeAll(
    //
    @Args({ name: 'page', type: () => Int }) page: number,
  ) {
    return this.noticeService.findALL({ page });
  }

  @Query(() => [Notice])
  fetchNoticeCategoryPick(
    @Args({ name: 'page', type: () => Int }) page: number,
    @Args('category') category: string,
  ) {
    return this.noticeService.findPick({ page, category });
  }
}
