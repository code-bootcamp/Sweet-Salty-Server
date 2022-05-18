import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BoardTagsInput } from '../board/dto/createBoardTags.input';
import { BoardTagService } from './boardTag.service';

@Resolver()
export class BoardTagResolver {
  constructor(
    //
    private readonly boardTagService: BoardTagService,
  ) {}

  @Mutation(() => String)
  async createTag(
    @Args('createBoardTagsInput') createBoardTagsInput: BoardTagsInput,
  ) {
    return this.boardTagService.create({ createBoardTagsInput });
  }
}