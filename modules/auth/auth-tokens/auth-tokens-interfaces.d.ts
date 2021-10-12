import { IResourceBase } from '../../../plugins/resource-maker/resource-model.d.ts';


export interface IAuthTokenBase {
  user: string;
  token: string;
  valid: boolean;
  validUntil?: number;
  usedAt?: number[];
  invalidatedAt?: number;
} export interface IAuthToken extends IAuthTokenBase, IResourceBase {}
