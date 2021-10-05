import { NHttp } from '../deps.ts';

const app = new NHttp();


import '../plugins/y-resource/y-router-provider.ts';


app.get('/ping', () => 'pong');


import { UserRouter } from '../modules/users/users-router.ts';
app.use('/api/users', UserRouter);


export function setupHttpTransport(port: number, afterListenCallback: () => void) {
  app.listen(port, afterListenCallback);
}
