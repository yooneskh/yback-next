import { IResourceBase } from '../../../plugins/resource-maker/resource-model.d.ts';


export interface IFactorBase {
  user: string;
  name: string;
  amount: number;
  payed?: boolean;
  payedAt?: number;
  payticket?: string;
  meta: Record<string, unknown>;
} export interface IFactor extends IFactorBase, IResourceBase {}
