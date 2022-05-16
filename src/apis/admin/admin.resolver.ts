import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BoardTagsInput } from '../board/dto/createBoardTags.input';
import { AdminService } from './admin.service';

@Resolver()
export class AdminResolver {
  constructor(
    //
    private readonly adminService: AdminService,
  ) {}

  @Mutation(() => String)
  createTag(
    //
    @Args('createBoardTagInput') createBoardTagsInput: BoardTagsInput,
  ) {
    return this.adminService.createTag({ createBoardTagsInput });
  }

  @Mutation(() => String)
  createTopCategory() {
    return this.adminService.createTopCategory();
  }

  @Mutation(() => String)
  createSubCategory() {
    return this.adminService.createSubCategory();
  }
}
