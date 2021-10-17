import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import { IFactorBase, IFactor } from './factors-interfaces.d.ts';


export const FactorMaker = new ResourceMaker<IFactorBase, IFactor>('Factor');
