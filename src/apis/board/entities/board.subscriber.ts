import {
  EventSubscriber,
  EntitySubscriberInterface,
  Connection,
  RemoveEvent,
} from 'typeorm';
import { SoftRemoveEvent } from 'typeorm/subscriber/event/SoftRemoveEvent';

import { Board } from './board.entity';

@EventSubscriber()
export class BoardSubscriber implements EntitySubscriberInterface<Board> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Board;
  }

  async afterSoftRemove(event: SoftRemoveEvent<Board>) {
    console.log(event);
    //console.log(event.entity);
    // const data = await event.connection.getRepository(Board).find(event.entity);

    //  console.log(data);
  }
}
