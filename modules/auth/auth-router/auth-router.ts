import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import { IAuthProvider } from './auth-router.d.ts';
import { AuthTokenController } from '../auth-tokens/auth-tokens-controller.ts';
import { Config } from "../../../config.ts";


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

    found = (await AuthTokenController.count({ filters: { token, valid: true } })) > 0;

  }

  return token;

}


const AuthRouterMaker = new ResourceMaker('AuthRouter');

AuthRouterMaker.addActions({
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

      const authToken = await AuthTokenController.create({
        document: {
          user,
          token,
          valid: true,
          validUntil: Config.auth.tokenLifetime ? Date.now() + Config.auth.tokenLifetime : undefined
        }
      });

      return authToken.token;

    }
  }
});

export const AuthRouter = AuthRouterMaker.getRouter();
