import { ResourceMaker } from '../../../plugins/resource-maker/resource-maker.ts';
import type { IRegisterTokenBase, IRegisterToken } from './register-tokens-interfaces.d.ts';


export const RegisterTokenMaker = new ResourceMaker<IRegisterTokenBase, IRegisterToken>('RegisterToken');
