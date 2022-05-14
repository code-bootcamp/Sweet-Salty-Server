import { env } from 'process';
import { Message } from 'src/apis/message/entitis/message.entity';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  Connection,
  UpdateEvent,
  InsertEvent,
  RemoveEvent,
  getConnection,
} from 'typeorm';
import { MessageInfo } from './messageInfo.entity';

@EventSubscriber()
export class MessageInfoSubscriber
  implements EntitySubscriberInterface<MessageInfo>
{
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return MessageInfo;
  }

  //   afterUpdate(event: UpdateEvent<MessageInfo>) {
  //     console.log(event.entity.messageInfoId);
  //     console.log(event.entity.messageInfoTitle);
  //     console.log(event.entity.messageInfoContents);
  //     console.log(event.entity.deleteCheckData);
  //     console.log(event.entity.createAt);
  //   }

  async afterUpdate(event: UpdateEvent<MessageInfo>) {
    const data = await event.connection
      .getRepository(MessageInfo)
      .findOne({ where: { messageInfoId: event.entity.messageInfoId } });

    // console.log(event.connection.getRepository(MessageInfo));

    // console.log(event.entity.messageInfoId);

    console.log(data);

    // if (data.deleteCheckData === 2) {
    //   await getConnection()
    //     .createQueryBuilder()
    //     .delete()
    //     .from(MessageInfo)
    //     .where({ messageInfoId: data.messageInfoId })
    //     .execute();
    // }
  }
}
