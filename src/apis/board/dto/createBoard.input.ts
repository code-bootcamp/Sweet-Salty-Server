import { Field, InputType } from '@nestjs/graphql';
import { BOARD_SUB_CATEGORY_NAME_ENUM } from '../entities/board.entity';

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

  @Field(() => BOARD_SUB_CATEGORY_NAME_ENUM)
  subCategoryName: string;

  @Field(() => PlaceInput)
  place: { PlaceInput: string };
}

@InputType()
export class CreateBoardWithReqInput {
  @Field(() => String)
  boardTitle: string;

  @Field(() => String)
  boardContents: string;

  @Field(() => BOARD_SUB_CATEGORY_NAME_ENUM)
  subCategoryName: string;
}

@InputType()
export class PlaceInput {
  @Field(() => String)
  placeName: string;

  @Field(() => String)
  placeAddress: string;

  @Field(() => String)
  placeUrl: string;

  @Field(() => String)
  lat: string;

  @Field(() => String)
  lng: string;
}
