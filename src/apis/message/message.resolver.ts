import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { gql } from 'apollo-server-express';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-user-param';
import { SendMessageInput } from './dto/sendMessage.input';
import { ReceivedMessage, SendMessage } from './entitis/message.entity';
import { MessageService } from './message.service';

@Resolver()
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ReceivedMessage])
  fetchReceivedMessages(
    @Args({ name: 'page', type: () => Int }) page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.messageService.receivedList({ page, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => ReceivedMessage)
  fetchReceivedMessage(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('messageInfoId') messageInfoId: string,
  ) {
    return this.messageService.readReceived({ messageInfoId, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [SendMessage])
  fetchSendMessages(
    //
    @Args({ name: 'page', type: () => Int }) page: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.messageService.sendList({ page, currentUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => SendMessage)
  fetchSendMessage(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('messageInfoId') messageInfoId: string,
  ) {
    return this.messageService.readSend({ currentUser, messageInfoId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  sendMessage(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('sendMessageInput') sendMessageInput: SendMessageInput,
  ) {
    return this.messageService.send({
      currentUser,
      sendMessageInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deleteSendMessage(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('messageInfoId') messageInfoId: string,
  ) {
    return this.messageService.deleteSend({ currentUser, messageInfoId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  deleteReceivedMessage(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('messageInfoId') messageInfoId: string,
  ) {
    return this.messageService.deleteReceived({ currentUser, messageInfoId });
  }
}
