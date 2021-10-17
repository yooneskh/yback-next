import { PayticketMaker } from './paytickets-resource.ts';
import './paytickets-controller.ts';


PayticketMaker.addActions({
  'list': {
    template: 'list',
    permission: 'admin.payticket.list'
  },
  'count': {
    template: 'count',
    permission: 'admin.payticket.count'
  },
  'retrieve': {
    template: 'retrieve',
    permission: 'admin.payticket.retrieve'
  },
  'create': {
    template: 'create',
    permission: 'admin.payticket.create'
  },
  'update': {
    template: 'update',
    permission: 'admin.payticket.update'
  },
  'delete': {
    template: 'delete',
    permission: 'admin.payticket.delete'
  }
});


export const PayticketRouter = PayticketMaker.getRouter();
