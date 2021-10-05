import { UserMaker } from './users-resource.ts';
import './users-controller.ts';


UserMaker.addActions([
  {
    method: 'post',
    path: '/0/:userId',
    handler: (context) => {
      context.response.send(context.params.userId + ' said hello raw!!');
    }
  },
  {
    method: 'get',
    path: '/1/:userId',
    provider: (context) => {
      return context.params.userId + ' said hello!';
    }
  },
  {
    method: 'get',
    path: '/2/:userId',
    provider: [
      (context) => {
        return context.params.userId + ' said hello from 1!';
      },
      (context) => {
        return context.params.userId + ' said hello from 2!';
      }
    ]
  },
  {
    method: 'get',
    path: '/3/:userId',
    provider: {
      'from db': (context) => {
        return context.params.userId + ' said hello from db!';
      },
      'from redis': (context) => {
        return context.params.userId + ' said hello from redis!';
      }
    }
  }
]);


export const UserRouter = UserMaker.getRouter();
