import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import { IAuthProvider } from './authentication-router.d.ts';
import { AuthenticationTokenController } from '../authentication-tokens/authentication-tokens-controller.ts';
import { Config } from '../../../config.ts';


const providers: IAuthProvider[] = [];

export function registerProvider(provider: IAuthProvider) {
  providers.push(provider);
}


async function makeFreshToken() {

  let found = false;
  let token = '';
  let iteration = 0;

  while (!found) {

    iteration++;
    if (iteration > 2000) {
      throw new Error('could not make a fresh unused token');
    }

    const intArray = new Uint32Array(32);
    crypto.getRandomValues(intArray);
    token = [...intArray].map(it => it.toString(16)).join('');

    found = (await AuthenticationTokenController.count({ filters: { token, valid: true } })) > 0;

  }

  return token;

}


const AuthenticationRouterMaker = new ResourceMaker('AuthRouter');

AuthenticationRouterMaker.addActions({
  'login': {
    method: 'post',
    path: '/login',
    provider: (context) => {

      const { provider } = context.payload;

      const providerAgent = providers.find(it => it.identifier === provider);
      if (!providerAgent) throw new Error('this provider is not supported');

      return providerAgent.login(context);

    }
  },
  'register': {
    method: 'post',
    path: '/register',
    provider: (context) => {

      const { provider } = context.payload;

      const providerAgent = providers.find(it => it.identifier === provider);
      if (!providerAgent) throw new Error('this provider is not supported');

      return providerAgent.register(context);

    }
  },
  'verify': {
    method: 'post',
    path: '/verify',
    provider: async (context) => {

      const { provider } = context.payload;

      const providerAgent = providers.find(it => it.identifier === provider);
      if (!providerAgent) throw new Error('this provider is not supported');

      const user = await providerAgent.verify(context);

      const token = await makeFreshToken();

      const authenticationToken = await AuthenticationTokenController.create({
        document: {
          user,
          token,
          valid: true,
          validUntil: Config.auth.tokenLifetime ? Date.now() + Config.auth.tokenLifetime : undefined
        }
      });

      return authenticationToken.token;

    }
  }
});

export const AuthenticationRouter = AuthenticationRouterMaker.getRouter();
