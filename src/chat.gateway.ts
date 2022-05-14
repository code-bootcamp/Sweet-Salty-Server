import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server;
  //서버에 액세스

  @SubscribeMessage('message') // 들어오는 메세지를 수신하고 다시 보내므로 데코레이터를 달아줌 인자는 클라이언트가 보내는 메세지의 이름
  handleMessage(@MessageBody() message: string): void {
    // MessageBody 메시지 본문을 추출
    // MessageBody는 데코레이터를 사용하지 않는 경우 들어오는 데이터 페이로드에서 메시지를 추출하는 것
    this.server.emit('message', message); // 모든 사람에게 메시지를 보내줌
    //
  }
}
