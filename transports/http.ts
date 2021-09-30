import { NHttp } from '../deps.ts';

const app = new NHttp();


app.get('/ping', () => 'pong');


export function setupHttpTransport(port: number, afterListenCallback: () => void) {
  app.listen(port, afterListenCallback);
}
