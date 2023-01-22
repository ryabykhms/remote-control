import { WebSocketServer } from 'ws';
import { MessageController } from './controllers';

const wss = new WebSocketServer({ port: 8080 });

const controller = new MessageController();

wss.on('connection', function connection(ws) {
  ws.on('message', async function message(data) {
    console.log('User sent message:', data);
    const response = await controller.handleMessage(...data.toString().split(' '));
    ws.send(response);
  });
});
