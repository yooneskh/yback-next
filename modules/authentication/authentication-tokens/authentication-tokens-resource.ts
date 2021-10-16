import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import type { IAuthenticationTokenBase, IAuthenticationToken } from './authentication-tokens-interfaces.d.ts';


export const AuthenticationTokenMaker = new ResourceMaker<IAuthenticationTokenBase, IAuthenticationToken>('AuthenticationToken');
