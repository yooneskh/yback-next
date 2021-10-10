import { VerificationTokenMaker } from './verification-tokens-resource.ts';
import './verification-tokens-controller.ts';


VerificationTokenMaker.addActions({
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


export const VerificationTokenRouter = VerificationTokenMaker.getRouter();
