import { NHttp } from '../deps.ts';

const app = new NHttp();


import '../plugins/y-router-provider/y-router-provider.ts';
import '../plugins/y-router-rest-templates/y-router-rest-templates.ts';


app.get('/ping', () => 'pong');


import { UserRouter } from '../modules/users/users-router.ts';
app.use('/api/users', UserRouter);

import { MediaRouter } from '../modules/media/media-router.ts';
app.use('/api/media', MediaRouter);


import { handleNHttpError } from '../plugins/error/handleable-error.ts';
app.onError(handleNHttpError);
app.on404(rev => rev.response.status(404).send('requested path was not found.'));


export function setupHttpTransport(port: number, afterListenCallback: () => void) {
  app.listen(port, afterListenCallback);
}
