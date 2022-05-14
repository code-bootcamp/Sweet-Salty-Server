import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardTagsInput {
  @Field(() => [String])
  boardTagMenu: string[];

  @Field(() => [String])
  boardTagRegion: string[];

  @Field(() => [String])
  boardTagTogether: string[];
}

//{ nullable: 'itemsAndList' }
