import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateBoardTagsInput } from '../board/dto/createBoardTags.input';
import { BoardTagService } from './boardTag.service';
import { BoardTag } from './entities/boardTag.entity';

@Resolver()
export class BoardTagResolver {
  constructor(
    //
    private readonly boardTagService: BoardTagService,
  ) {}

  @Mutation(() => String)
  async createTag(
    @Args('createBoardTagsInput') createBoardTagsInput: CreateBoardTagsInput,
  ) {
    console.log(33);
    return this.boardTagService.create({ createBoardTagsInput });
  }
}
