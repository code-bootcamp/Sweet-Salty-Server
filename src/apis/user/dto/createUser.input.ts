import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  userEmail: string;

  @Field(() => String)
  userPassword: string;

  @Field(() => String)
  userName: string;

  @Field(() => String)
  userPhone: string;

  @Field(() => String)
  userNickname: string;

  @Field(() => String, { nullable: true })
  userAddress: string;
}
