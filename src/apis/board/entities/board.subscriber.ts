import {
  EventSubscriber,
  EntitySubscriberInterface,
  Connection,
  RemoveEvent,
} from 'typeorm';

import { Board } from './board.entity';

@EventSubscriber()
export class BoardSubscriber implements EntitySubscriberInterface<Board> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Board;
  }

  async afterRemove(event: RemoveEvent<Board>) {}
}
