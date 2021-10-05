import { NHttp } from '../deps.ts';

const app = new NHttp();


import '../plugins/y-resource/y-router-provider.ts';


app.get('/ping', () => 'pong');


import { UserRouter } from '../modules/users/users-router.ts';
app.use('/api/users', UserRouter);


import { handleNHttpError } from '../plugins/error/handleable-error.ts';
app.onError(handleNHttpError);
app.on404(rev => rev.response.status(404).send('requested item was not found.'));


export function setupHttpTransport(port: number, afterListenCallback: () => void) {
  app.listen(port, afterListenCallback);
}
