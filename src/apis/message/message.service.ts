import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { MessageInfo } from '../messageInfo/entities/messageInfo.entity';
import { User } from '../user/entities/user.entity';
import { Message } from './entitis/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async sendList({ page, currentUser }) {
    return await this.messageRepository.find({
      where: {
        messageOwner: currentUser.userId,
        sendReceived: 'SEND',
      },
      relations: ['messageInfo'],
      skip: (page - 1) * 10,
      take: 10,
      order: { sendAt: 'DESC' },
    });
  }

  async readSend({ messageInfoId, currentUser }) {
    const result = await this.messageRepository.findOne({
      where: {
        messageOwner: currentUser.userId,
        sendReceived: 'SEND',
        messageInfo: messageInfoId,
      },
      relations: ['messageInfo'],
    });

    return result;
  }

  async sendListCount({ currentUser }) {
    return await getConnection()
      .createQueryBuilder()
      .from(Message, 'message')
      .where({ messageOwner: currentUser.userId, sendReceived: 'SEND' })
      .getCount();
  }

  async receivedList({ page, currentUser }) {
    return await this.messageRepository.find({
      where: {
        messageOwner: currentUser.userId,
        sendReceived: 'RECEIVED',
      },
      relations: ['messageInfo'],
      skip: (page - 1) * 10,
      take: 10,
      order: { sendAt: 'DESC' },
    });
  }

  async readReceived({ messageInfoId, currentUser }) {
    const result = await this.messageRepository.findOne({
      where: {
        messageOwner: currentUser.userId,
        sendReceived: 'RECEIVED',
        messageInfo: messageInfoId,
      },
      relations: ['messageInfo'],
    });

    await this.messageRepository.update(
      { messageId: result.messageId },
      { messageState: true },
    );
    return result;
  }

  async receivedListCount({ currentUser }) {
    return await getConnection()
      .createQueryBuilder()
      .from(Message, 'message')
      .where({ messageOwner: currentUser.userId, sendReceived: 'RECEIVED' })
      .getCount();
  }

  async send({ currentUser, sendMessageInput }) {
    const receive = await this.userRepository.findOne({
      where: {
        userNickname: sendMessageInput.receiveUser,
      },
    });

    const send = await this.userRepository.findOne({
      where: {
        userId: currentUser.userId,
      },
    });

    if (!receive) throw new ConflictException('받는 분이 존재하지 않습니다.');
    if (currentUser.userId === receive.userId)
      throw new ConflictException('본인에게는 보낼 수 없습니다.');

    const messageData = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(MessageInfo)
      .values([
        {
          messageInfoContents: sendMessageInput.contents,
        },
      ])
      .execute();

    await this.messageRepository.save({
      messageReceivedUser: receive.userNickname,
      sendReceived: 'SEND',
      messageInfo: messageData.identifiers[0].messageInfoId,
      messageOwner: currentUser.userId,
    });

    await this.messageRepository.save({
      messageSendUser: send.userNickname,
      sendReceived: 'RECEIVED',
      messageInfo: messageData.identifiers[0].messageInfoId,
      messageOwner: receive.userId,
    });

    return '메세지가 성공적으로 발송되었습니다.';
  }

  async deleteSend({ messageInfoId, currentUser }) {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Message)
      .where({ messageInfo: messageInfoId, messageOwner: currentUser.userId })
      .execute();

    await getConnection()
      .createQueryBuilder()
      .update(MessageInfo)
      .set({ deleteCheckData: () => `deleteCheckData+1` })
      .where({ messageInfoId })
      .execute();

    return '메세지가 삭제되었습니다.';
  }

  async deleteReceived({ messageInfoId, currentUser }) {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Message)
      .where({ messageInfo: messageInfoId, messageOwner: currentUser.userId })
      .execute();

    await getConnection()
      .createQueryBuilder()
      .update(MessageInfo)
      .set({ deleteCheckData: () => `deleteCheckData+1` })
      .where({ messageInfoId })
      .execute();

    return '메세지가 삭제되었습니다.';
  }
}
