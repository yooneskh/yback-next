import { AuthenticationTokenMaker } from './authentication-tokens-resource.ts';
import './authentication-tokens-controller.ts';


AuthenticationTokenMaker.addActions({
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


export const AuthenticationTokenRouter = AuthenticationTokenMaker.getRouter();
