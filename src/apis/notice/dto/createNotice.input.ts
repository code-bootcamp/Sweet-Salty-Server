import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class createNoticeInput {
  @Field(() => String)
  noticeTitle: string;

  @Field(() => String)
  noticeContents: string;

  @Field(() => String)
  noticeCategory: string;
}
