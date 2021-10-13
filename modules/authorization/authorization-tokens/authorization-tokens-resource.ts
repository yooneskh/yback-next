import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import { IAuthorizationTokenBase, IAuthorizationToken } from './authorization-tokens-interfaces.d.ts';


export const AuthorizationTokenMaker = new ResourceMaker<IAuthorizationTokenBase, IAuthorizationToken>('AuthorizationToken');
