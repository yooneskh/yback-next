import { IResourceBase } from '../../../plugins/resource-maker/resource-model.d.ts';


export interface IVerificationTokenBase {
  user?: string;
  registerToken?: string;
  channel: 'sms';
  code: string;
  used?: boolean;
  usedAt?: number;
} export interface IVerificationToken extends IVerificationTokenBase, IResourceBase {}
