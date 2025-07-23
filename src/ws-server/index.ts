import { createWebSocketStream, WebSocket, WebSocketServer } from 'ws';
import { MessageController } from '../controllers';

class WSServer {
  private server: WebSocketServer;
  private controller: MessageController;

  constructor() {
    this.controller = new MessageController();
  }

  public listen(port: number) {
    this.server = new WebSocketServer({ port }, () => {
      console.log(`Web Socket Server started on PORT ${port}`);
    });

    this.server.on('connection', this.handleConnection.bind(this));
    this.server.on('close', this.handleClose.bind(this));
    this.server.on('error', this.handleError.bind(this));
  }

  private async handleConnection(ws: WebSocket): Promise<void> {
    const webSocketStream = createWebSocketStream(ws, {
      decodeStrings: false,
      encoding: 'utf-8',
    });

    webSocketStream.on('data', async (data: string) => {
      console.log('User sent message:', data);
      const response = await this.controller.handleMessage(...data.split(' '));
      webSocketStream.write(response);
    });
  }

  private handleClose(): void {
    console.log('WebSocket connection was closed');
  }

  private handleError(error: Error): void {
    console.error(error);
  }
}

export const wsServer = new WSServer();
