import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  boardTitle: string;

  @Field(() => String)
  boardContents: string;

  @Field(() => String)
  boardWriter: string;
}
