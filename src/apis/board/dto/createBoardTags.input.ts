import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBoardTagsInput {
  @Field(() => [String], { nullable: true })
  boardTagMenu: string[];

  @Field(() => [String], { nullable: true })
  boardTagRegion: string[];

  @Field(() => [String], { nullable: true })
  boardTagMood: string[];
}

//{ nullable: 'itemsAndList' }
