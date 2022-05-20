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

  @Field(() => [String])
  url: string[];

  @Field(() => PlaceInput)
  place: { PlaceInput: string };
}

@InputType()
class PlaceInput {
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
