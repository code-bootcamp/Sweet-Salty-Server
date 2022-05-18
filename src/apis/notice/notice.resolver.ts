import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { createNoticeInput } from './dto/createNotice.input';
import { noticeService } from './notice.service';

@Resolver()
export class noticeResolver {
  constructor(private readonly noticeService: noticeService) {}

  @Mutation(() => String)
  createNotice(
    @Args('createNoticeInput') createNoticeInput: createNoticeInput,
  ) {
    return this.noticeService.create({ createNoticeInput });
  }
}
