import { AuthorizationRoleMaker } from './authorization-roles-resource.ts';
import './authorization-roles-model.ts';


export const AuthorizationRoleController = AuthorizationRoleMaker.getController();


AuthorizationRoleMaker.addValidations({ });
