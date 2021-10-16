import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import type { IAuthorizationRoleBase, IAuthorizationRole } from './authorization-roles-interfaces.d.ts';


export const AuthorizationRoleMaker = new ResourceMaker<IAuthorizationRoleBase, IAuthorizationRole>('AuthorizationRole');
