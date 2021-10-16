import type { IResourceBase } from '../../../plugins/resource-maker/resource-model.d.ts';


export interface IAuthenticationTokenBase {
  user: string;
  token: string;
  valid: boolean;
  validUntil?: number;
  usedAt?: number[];
  invalidatedAt?: number;
} export interface IAuthenticationToken extends IAuthenticationTokenBase, IResourceBase {}
