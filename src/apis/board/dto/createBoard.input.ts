import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  boardTitle: string;

  @Field(() => String, { nullable: true })
  boardSugar: string;

  @Field(() => String, { nullable: true })
  boardSalt: string;

  @Field(() => String)
  boardContents: string;

  @Field(() => String, { nullable: true })
  store: string;
}
