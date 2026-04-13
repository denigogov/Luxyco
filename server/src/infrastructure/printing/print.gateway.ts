import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, WebSocket } from 'ws';

@WebSocketGateway({
  path: '/print',
  cors: true,
})
export class PrintGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly clients = new Set<WebSocket>();

  handleConnection(client: WebSocket) {
    this.clients.add(client);
  }

  handleDisconnect(client: WebSocket) {
    this.clients.delete(client);
  }

  getClientCount() {
    return this.clients.size;
  }

  broadcast(payload: unknown): number {
    const message = JSON.stringify(payload);
    let sent = 0;
    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message);
        sent++;
      }
    });
    return sent;
  }
}
