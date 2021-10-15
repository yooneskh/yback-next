import { NHttp } from '../deps.ts';

const app = new NHttp();


import '../plugins/provider-router-addon/provider-router-addon.ts';
import '../plugins/rest-templates-router-addon/rest-templates-router-addon.ts';
import '../plugins/validators-router-addon/validators-router-addon.ts';


app.get('/ping', () => 'pong');


import { UserRouter } from '../modules/users/users-router.ts';
app.use('/api/users', UserRouter);


import { AuthenticationRouter } from '../modules/authentication/authentication-router/authentication-router.ts';
import { AuthenticationTokenRouter } from '../modules/authentication/authentication-tokens/authentication-tokens-router.ts';
import { RegisterTokenRouter } from '../modules/authentication/register-tokens/register-tokens-router.ts';
import { VerificationTokenRouter } from '../modules/authentication/verification-tokens/verification-tokens-router.ts';
app.use('/api/auth', AuthenticationRouter);
app.use('/api/authentication-tokens', AuthenticationTokenRouter);
app.use('/api/register-tokens', RegisterTokenRouter);
app.use('/api/verification-tokens', VerificationTokenRouter);

import '../modules/authentication/providers/authentication-phone-provider.ts';
import '../modules/authentication/lib/authentication-router-addon.ts';


import { AuthorizationTokenRouter } from '../modules/authorization/authorization-tokens/authorization-tokens-router.ts';
import { AuthorizationRoleRouter } from '../modules/authorization/authorization-roles/authorization-roles-router.ts';
app.use('/api/authorization-tokens', AuthorizationTokenRouter);
app.use('/api/authorization-roles', AuthorizationRoleRouter);

import '../modules/authorization/authorization-tokens/authorization-tokens-event-listener.ts';
import '../modules/authorization/lib/authorization-router-addon.ts';


import { MediaRouter } from '../modules/media/media-router.ts';
app.use('/api/media', MediaRouter);


import { handleNHttpError } from '../plugins/error/handleable-error.ts';
app.onError(handleNHttpError);
app.on404(rev => rev.response.status(404).send('requested path was not found.'));


export function setupHttpTransport(port: number, afterListenCallback: () => void) {
  app.listen(port, afterListenCallback);
}
