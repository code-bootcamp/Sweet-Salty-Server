import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class updateShopInput {
  @Field(() => String, { nullable: true })
  productName: string;

  @Field(() => String, { nullable: true })
  seller: string;

  @Field(() => Int, { nullable: true })
  disCount: number;

  @Field(() => Int, { nullable: true })
  disCountPrice: number;

  @Field(() => Int, { nullable: true })
  originalPrice: number;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Int, { nullable: true })
  stock: number;

  @Field(() => String, { nullable: true })
  shopUrl: string;
}
