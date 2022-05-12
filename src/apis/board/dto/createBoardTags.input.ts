import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardTagsInput {
  @Field(() => [String], { nullable: 'itemsAndList' })
  boardTagMenu: string[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  boardTagRegion: string[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  boardTagTogether: string[];
}
