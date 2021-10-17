import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import { IPayticketBase, IPayticket } from './paytickets-interfaces.d.ts';


export const PayticketMaker = new ResourceMaker<IPayticketBase, IPayticket>('Payticket');
