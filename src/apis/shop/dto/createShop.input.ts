import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateShopInput {
  @Field(() => String)
  shopProductName: string;

  @Field(() => String)
  shopSeller: string;

  @Field(() => Float)
  shopDisCount: number;

  @Field(() => Float)
  shopDisCountPrice: number;

  @Field(() => Int)
  shopOriginalPrice: number;

  @Field(() => String)
  shopDescription: string;

  @Field(() => Int)
  shopStock: number;

  @Field(() => String)
  shopUrl: string;
}