import 'dotenv/config';

import { httpServer } from './http-server';
import { wsServer } from './ws-server';

const httpPort = Number.parseInt(process.env.HTTP_PORT || '8181', 10);
const wsPort = Number.parseInt(process.env.WEB_SOCKET_PORT || '8080', 10);

console.log(`Start static http server on the ${httpPort} port!`);
httpServer.listen(httpPort);
wsServer.listen(wsPort);
