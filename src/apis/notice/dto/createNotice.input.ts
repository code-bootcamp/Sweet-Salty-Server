import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNoticeInput {
  @Field(() => String)
  noticeTitle: string;

  @Field(() => String)
  noticeContents: string;

  @Field(() => String)
  noticeCategory: string;
}
