import { UseGuards } from '@nestjs/common';
import { Query, Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { commentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Resolver()
export class commentResolver {
  constructor(private readonly commentService: commentService) {}

  @Query(() => [Comment])
  fetchComment(@Args('boardId') boardId: string) {
    return this.commentService.findAll({ boardId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  createComment(
    @Args('boardId') boardId: string,
    @Args('contents') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.commentService.create({ boardId, currentUser, contents });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  updateComment(
    @Args('boardId') boardId: string,
    @Args('contents') contents: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.commentService.update({
      currentUser,
      boardId,
      contents,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deleteComment(@Args('commentId') commentId: string) {
    return this.commentService.delete({
      commentId,
    });
  }
}
