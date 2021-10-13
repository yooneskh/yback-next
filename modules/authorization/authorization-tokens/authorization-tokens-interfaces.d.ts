import { IResourceBase } from '../../../plugins/resource-maker/resource-model.d.ts';


export interface IAuthorizationTokenBase {
  user: string;
  permissions: string[];
  roles: string[];
} export interface IAuthorizationToken extends IAuthorizationTokenBase, IResourceBase {}
