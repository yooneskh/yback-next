import { AuthorizationRoleMaker } from './authorization-roles-resource.ts';
import './authorization-roles-controller.ts';


AuthorizationRoleMaker.addActions({
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


export const AuthorizationRoleRouter = AuthorizationRoleMaker.getRouter();
