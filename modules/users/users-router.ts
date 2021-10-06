import { UserMaker } from './users-resource.ts';
import './users-controller.ts';


UserMaker.addActions([
  {
    template: 'list'
  },
  {
    template: 'count'
  },
  {
    template: 'retrieve'
  },
  {
    template: 'create'
  },
  {
    template: 'update'
  },
  {
    template: 'delete'
  },
]);


export const UserRouter = UserMaker.getRouter();
