import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  boardTitle: string;

  @Field(() => String)
  boardSugar: string;

  @Field(() => String)
  boardSalt: string;

  @Field(() => String)
  boardContents: string;
}
