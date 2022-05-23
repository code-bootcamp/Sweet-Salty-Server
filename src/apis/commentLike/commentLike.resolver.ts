import { Query, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { commentLikeService } from './commentLike.service';
import { CommentLike } from './entities/commentLike.entity';

@Resolver()
export class commentLikeResolver {
  constructor(private readonly commentLikeService: commentLikeService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => CommentLike)
  createCommentLike(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('boardId') boardId: string,
    @Args('commentId') commentId: string,
  ) {
    return this.commentLikeService.create({ currentUser, boardId, commentId });
  }
}
