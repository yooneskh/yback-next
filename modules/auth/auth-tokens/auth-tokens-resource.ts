import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import { IAuthTokenBase, IAuthToken } from './auth-tokens-interfaces.d.ts';


export const AuthTokenMaker = new ResourceMaker<IAuthTokenBase, IAuthToken>('AuthToken');
