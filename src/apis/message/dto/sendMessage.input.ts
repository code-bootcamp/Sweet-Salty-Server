import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;

  @Field(() => String)
  receiveUser: string;
}
