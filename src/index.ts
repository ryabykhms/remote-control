import 'dotenv/config';
import { createWebSocketStream, WebSocketServer } from 'ws';
import { MessageController } from './controllers';

const port = Number.parseInt(process.env.WEB_SOCKET_PORT || '8080', 10);

const webSocketServer = new WebSocketServer({ port }, () => {
  console.log(`Web Socket Server started on PORT ${port}`);
});

const controller = new MessageController();

webSocketServer.on('connection', (ws) => {
  const webSocketStream = createWebSocketStream(ws, {
    decodeStrings: false,
    encoding: 'utf-8',
  });

  webSocketStream.on('data', async (data: string) => {
    console.log('User sent message:', data);
    const response = await controller.handleMessage(...data.split(' '));
    webSocketStream.write(response);
  });
});

webSocketServer.on('close', () => {
  console.log('WebSocket connection was closed');
});

webSocketServer.on('error', (err) => {
  console.error(err);
});
