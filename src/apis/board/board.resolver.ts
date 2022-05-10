import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardService } from './board.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { UpdateBoardInput } from './dto/updateBoard.input';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardResolver {
  constructor(private readonly boardService: BoardService) {}

  @Query(() => [Board])
  fetchBoards() {

    console.log("aaa")
    return this.boardService.findAll();
  }

  @Query(() => Board)
  fetchBoard(@Args('boardId') boardId: string) {
    return this.boardService.findOne({ boardId });
  }

  @Mutation(() => Board)
  createBoard(@Args('createBoardInput') createBoardInput: CreateBoardInput) {
    return this.boardService.create({ createBoardInput }); // 받아온 name 넘기기 service로
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
