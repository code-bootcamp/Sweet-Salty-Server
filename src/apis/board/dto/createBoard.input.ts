import { Field, InputType } from '@nestjs/graphql';
import { SUB_CATEGORY_NAME_ENUM } from '../entities/board.entity';

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

  @Field(() => SUB_CATEGORY_NAME_ENUM)
  subCategoryName: string;
}
