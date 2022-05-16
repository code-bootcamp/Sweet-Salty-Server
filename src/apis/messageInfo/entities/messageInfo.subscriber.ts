import {
  EventSubscriber,
  EntitySubscriberInterface,
  Connection,
  UpdateEvent,
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

  async afterUpdate(event: UpdateEvent<MessageInfo>) {
    const data = await event.connection
      .getRepository(MessageInfo)
      .findOne({ where: { messageInfoId: event.entity.messageInfoId } });

    console.log(data);
  }
}
