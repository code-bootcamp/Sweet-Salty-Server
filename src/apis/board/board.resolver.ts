import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { CreateBoardTagsInput } from './dto/createBoardTags.input';
import { UpdateBoardInput } from './dto/updateBoard.input';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => [Board])
  fetchBoards(
    //
    @Args('search') search: string,
  ) {
    return this.boardService.findAll();
  }

  @Query(() => Board)
  fetchBoard(@Args('boardId') boardId: string) {
    return this.boardService.findOne({ boardId });
  }

  @Query(() => [Board])
  fetchTestBoards(
    @Args('boardTagsInput') boardTagsInput: CreateBoardTagsInput,
  ) {
    return this.boardService.findTest({ boardTagsInput });
  }

  @Mutation(() => Board)
  createBoard(
    //

    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @Args('createBoardTagsInput') createBoardTagsInput: CreateBoardTagsInput,
  ) {
    return this.boardService.create({ createBoardInput, createBoardTagsInput }); // 받아온 name 넘기기 service로
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board)
  createBoardUserLoggedin(
    //
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @Args('createBoardTagsInput') createBoardTagsInput: CreateBoardTagsInput,
  ) {
    return this.boardService.loginCreate({
      currentUser,
      createBoardInput,
      createBoardTagsInput,
    });
  }

  @Mutation(() => Board)
  async updateBoard(
    @Args('boardId') boardId: string,

    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    return await this.boardService.update({
      boardId,
      updateBoardInput,
    });
  }

  @Mutation(() => Boolean)
  deleteBoard(@Args('boardId') boardId: string) {
    return this.boardService.delete({ boardId });
  }
}
