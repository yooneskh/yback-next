import { AuthorizationTokenMaker } from './authorization-tokens-resource.ts';
import './authorization-tokens-controller.ts';


AuthorizationTokenMaker.addActions({
  'list': {
    template: 'list'
  },
  'count': {
    template: 'count'
  },
  'retrieve': {
    template: 'retrieve'
  },
  'create': {
    template: 'create'
  },
  'update': {
    template: 'update'
  },
  'delete': {
    template: 'delete'
  }
});


export const AuthorizationTokenRouter = AuthorizationTokenMaker.getRouter();
