import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateShopInput {
  @Field(() => String)
  productName: string;

  @Field(() => String)
  seller: string;

  @Field(() => Int)
  disCount: number;

  @Field(() => Int)
  disCountPrice: number;

  @Field(() => Int)
  originalPrice: number;

  @Field(() => String)
  description: string;

  @Field(() => Int)
  stock: number;

  @Field(() => String)
  shopUrl: string;
}
